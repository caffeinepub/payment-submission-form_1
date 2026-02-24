import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type PaymentRecord = {
    fullName : Text;
    address : Text;
    email : Text;
    maskedCardNumber : Text;
    expirationDate : Text;
    amount : Nat;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let paymentRecords = Map.empty<Text, PaymentRecord>();

  let ADMIN_PASSWORD = "super_secure_admin_password";

  func getLastFourDigits(cardNumber : Text) : Text {
    if (cardNumber.size() >= 4) {
      let length = cardNumber.size();
      let chars = cardNumber.chars();
      let iter = chars.enumerate().filterMap(
        func(((i, c))) {
          if (i >= length - 4) { ?c } else { null };
        }
      );
      Text.fromIter(iter);
    } else {
      "";
    };
  };

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkUserPermission(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user) { checkAdminPermission(caller) };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkUserPermission(caller);
    userProfiles.add(caller, profile);
  };

  public shared func submitPayment(
    fullName : Text,
    address : Text,
    email : Text,
    cardNumber : Text,
    expirationDate : Text,
    amount : Nat,
  ) : async () {
    let maskedCardNumber = getLastFourDigits(cardNumber);

    let record : PaymentRecord = {
      fullName;
      address;
      email;
      maskedCardNumber;
      expirationDate;
      amount;
      timestamp = Time.now();
    };

    let key = maskedCardNumber # "_" # email # "_" # Time.now().toText();
    paymentRecords.add(key, record);
  };

  public shared ({ caller }) func getMaskedCardNumber(cardNumber : Text) : async Text {
    checkUserPermission(caller);
    getLastFourDigits(cardNumber);
  };

  public shared ({ caller }) func getPaymentRecordsByEmail(email : Text) : async [PaymentRecord] {
    checkAdminPermission(caller);
    paymentRecords.values().toArray().filter(
      func(record) { Text.equal(record.email, email) }
    );
  };

  public query ({ caller }) func getPaymentAmount(recordKey : Text) : async AmountResponse {
    checkAdminPermission(caller);
    switch (paymentRecords.get(recordKey)) {
      case (null) { #error("Record not found") };
      case (?record) { #amount(record.amount) };
    };
  };

  public shared ({ caller }) func isAdminPanelAccessGranted(password : Text) : async Bool {
    checkAdminPermission(caller);
    password == ADMIN_PASSWORD;
  };

  public type AmountResponse = {
    #amount : Nat;
    #error : Text;
  };

  public shared ({ caller }) func getAllPaymentRecords(password : Text) : async [PaymentRecord] {
    checkAdminPermission(caller);
    if (password != ADMIN_PASSWORD) {
      Runtime.trap("Invalid admin password");
    };
    paymentRecords.values().toArray();
  };

  public shared ({ caller }) func getRecordsByAmountRange(
    password : Text,
    minAmount : Nat,
    maxAmount : Nat,
  ) : async [PaymentRecord] {
    checkAdminPermission(caller);
    if (password != ADMIN_PASSWORD) {
      Runtime.trap("Invalid admin password");
    };
    paymentRecords.values().toArray().filter(
      func(record) { record.amount >= minAmount and record.amount <= maxAmount }
    );
  };

  func checkUserPermission(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func checkAdminPermission(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
