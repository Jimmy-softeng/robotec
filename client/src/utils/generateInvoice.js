import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generate & Print / Download Invoice PDF
 * @param {Object} order
 * @param {"print" | "download"} action
 */
export const generateInvoicePDF = (order, action = "print") => {
  const doc = new jsPDF();

  /* ===============================
     COMPANY DETAILS
  =============================== */
  const COMPANY = {
    name: "Robotec Solutions Ltd",
    address: "Moi Avenue, Nairobi",
    phone: "+254 712 345 678",
    email: "info@robotec.co.ke",
  };

  /* ===============================
     HEADER
  =============================== */
  doc.setFontSize(18);
  doc.text(COMPANY.name, 14, 20);

  doc.setFontSize(10);
  doc.text(COMPANY.address, 14, 26);
  doc.text(`Phone: ${COMPANY.phone}`, 14, 31);
  doc.text(`Email: ${COMPANY.email}`, 14, 36);

  doc.setFontSize(16);
  doc.text("INVOICE", 150, 20);

  /* ===============================
     ORDER INFO
  =============================== */
  doc.setFontSize(10);
  doc.text(`Order No: ${order.order_number}`, 14, 50);
  doc.text(`Order ID: ${order.order_id}`, 14, 56);
  doc.text(`Status: ${order.status}`, 14, 62);
  doc.text(`Payment: ${order.payment_status}`, 14, 68);

  doc.text(
    `Date: ${new Date(order.created_at || Date.now()).toLocaleString()}`,
    14,
    74
  );

  /* ===============================
     ITEMS TABLE
  =============================== */
  const tableData = order.items.map((item, index) => [
    index + 1,
    item.product_name,
    item.quantity,
    `KES ${item.product_price.toLocaleString()}`,
    `KES ${item.subtotal.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [["#", "Product", "Qty", "Price", "Subtotal"]],
    body: tableData,
  });

  /* ===============================
     TOTALS
  =============================== */
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.text(`Subtotal: KES ${order.subtotal.toLocaleString()}`, 140, finalY);
  doc.text(
    `Shipping: KES ${order.shipping_cost.toLocaleString()}`,
    140,
    finalY + 6
  );

  doc.setFontSize(12);
  doc.text(
    `TOTAL: KES ${order.total_amount.toLocaleString()}`,
    140,
    finalY + 14
  );

  /* ===============================
     FOOTER
  =============================== */
  doc.setFontSize(9);
  doc.text(
    "Thank you for doing business with Robotec Solutions Ltd",
    14,
    285
  );

  /* ===============================
     PRINT OR DOWNLOAD
  =============================== */
  if (action === "download") {
    doc.save(`Invoice-${order.order_number}.pdf`);
  } else {
    window.open(doc.output("bloburl"), "_blank");
  }
};
