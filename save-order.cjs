const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldVerify = \`    // HMAC Signature verification on the server
    if (keySecret && keySecret !== "rzp_test_DUMMY_KEY_123" && !keySecret.includes("DUMMY") && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Payment verification was unsuccessful. Please contact us before trying again." });
      }
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });\`;

const newVerify = \`    // HMAC Signature verification on the server
    if (keySecret && keySecret !== "rzp_test_DUMMY_KEY_123" && !keySecret.includes("DUMMY") && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Payment verification was unsuccessful. Please contact us before trying again." });
      }
    }

    // Save successful order to Firestore
    try {
      await db.collection("orders").doc(razorpay_order_id).set({
        email: user.email,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        verifiedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to save order to Firestore:", err);
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });\`;

code = code.replace(oldVerify, newVerify);

fs.writeFileSync('server.ts', code);
console.log('Done mapping orders to Firestore.');
