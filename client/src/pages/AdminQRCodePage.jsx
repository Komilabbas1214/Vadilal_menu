import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const AdminQRCodePage = () => {
  const [storeUrl, setStoreUrl] = useState(window.location.origin);
  const [tableNumber, setTableNumber] = useState('01');

  const handlePrint = () => {
    window.print();
  };

  const currentQrUrl = `${storeUrl}/?table=${tableNumber}`;

  return (
    <div className="container py-4">
      {/* Control panel (hidden when printing) */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white no-print">
        <h4 className="fw-bold text-dark mb-3">Store Table QR Code Generator</h4>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Customer Ordering Website URL</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label fw-semibold">Table Number</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="01"
            />
          </div>

          <div className="col-12 col-md-3 d-flex align-items-end">
            <button className="btn btn-pink text-white w-100 py-2 rounded-pill fw-bold" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print Standee
            </button>
          </div>
        </div>
      </div>

      {/* Printable Standee Template */}
      <div className="printable-standee my-4">
        <div className="mb-2">
          <span className="badge bg-pink text-white rounded-pill px-3 py-1 fs-6 fw-bold" style={{ backgroundColor: '#ff477e' }}>
            TABLE {tableNumber}
          </span>
        </div>

        <h1 className="fw-extrabold display-5 text-dark mb-1">SCAN & ORDER 🍦</h1>
        <h5 className="fw-bold text-purple mb-4" style={{ color: '#7b2cbf' }}>
          Ask AI what you should eat!
        </h5>

        <div className="p-4 bg-white rounded-4 d-inline-block shadow-sm mb-4 border border-2 border-pink-subtle">
          <QRCodeSVG value={currentQrUrl} size={220} level="H" includeMargin={true} />
        </div>

        <div className="bg-light p-3 rounded-3 max-width-350 mx-auto border">
          <div className="d-flex align-items-center justify-content-center gap-2 text-dark font-weight-bold mb-1 fw-bold">
            <span>🤖</span> Powered by Hangout AI
          </div>
          <p className="small text-muted mb-0">
            Scan with your phone camera to view menu & order directly to your table!
          </p>
        </div>

        <div className="mt-4 text-muted small">
          Hangout Ice Cream Store • Smart Self-Ordering
        </div>
      </div>
    </div>
  );
};

export default AdminQRCodePage;
