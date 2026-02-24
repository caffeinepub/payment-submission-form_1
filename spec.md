# Specification

## Summary
**Goal:** Remove the login/authentication requirement from the payment submission page so customers can submit payments without logging in.

**Planned changes:**
- Remove the Internet Identity login check and any login prompt/gate from the `PaymentForm` component, allowing the form to be fully interactive and submittable without authentication
- Update the backend `submitPayment` function to accept calls from anonymous (unauthenticated) identities and store those payment records normally
- Ensure admin panel authentication remains intact and unaffected

**User-visible outcome:** Customers can open the payment page, fill out the form, and submit a payment without any login prompt or authentication step. Submitted payments still appear in the admin panel.
