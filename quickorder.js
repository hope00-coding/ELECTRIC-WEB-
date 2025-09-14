import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, CreditCard, AlertCircle, Check, DollarSign, Package, ShoppingCart } from 'lucide-react';

function QuickOrder() {
  const [productInput, setProductInput] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('piece');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
  const paypalButtonsRef = useRef(null);

  // Mock product suggestions
  const productSuggestions = [
    'iPhone 15 Pro Max',
    'iPad Air M2',
    'MacBook Pro 16"',
    'AirPods Pro',
    'Apple Watch Series 9',
    'Samsung Galaxy S24',
    'Dell XPS 13',
    'Sony WH-1000XM5'
  ];

  // Mock prices for products
  const productPrices = {
    'iPhone 15 Pro Max': 1199,
    'iPad Air M2': 599,
    'MacBook Pro 16"': 2499,
    'AirPods Pro': 249,
    'Apple Watch Series 9': 399,
    'Samsung Galaxy S24': 899,
    'Dell XPS 13': 999,
    'Sony WH-1000XM5': 399
  };

  const handleAddProduct = () => {
    if (productInput.trim() && quantity > 0) {
      const price = productPrices[productInput] || Math.floor(Math.random() * 500) + 50;
      const newItem = {
        id: Date.now(),
        product: productInput,
        quantity: parseInt(quantity),
        unit: unit,
        price: price,
        total: price * quantity
      };
      setOrderItems([...orderItems, newItem]);
      setProductInput('');
      setQuantity(1);
      setShowSuggestions(false);
    }
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleProductSelect = (product) => {
    setProductInput(product);
    setShowSuggestions(false);
  };

  const filteredSuggestions = productSuggestions.filter(product =>
    product.toLowerCase().includes(productInput.toLowerCase())
  );

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
  const deliveryFee = 25;
  const total = subtotal - discount + deliveryFee;

  // PayPal entegrasyonu
  useEffect(() => {
    // PayPal scriptini yükle
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AY2jC4xQkHqVJp3p3p3p3p3p3p3p3p3p3p3p3p3p3p3p3p3p3p3p3p&currency=USD`;
    script.addEventListener('load', () => {
      // Script yüklendikten sonra butonları oluştur
      if (window.paypal && paypalButtonsRef.current) {
        window.paypal.Buttons({
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: total.toFixed(2)
                }
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              // Ödeme başarılı olduğunda
              setPaymentSuccess(true);
              setOrderItems([]);
              setTimeout(() => setPaymentSuccess(false), 5000);
            });
          },
          onError: function (err) {
            // Ödeme hatası olduğunda
            setPaymentError('Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            console.error('PayPal error:', err);
          }
        }).render(paypalButtonsRef.current);
      }
    });
    document.body.appendChild(script);

    return () => {
      // Component unmount olduğunda scripti temizle
      document.body.removeChild(script);
    };
  }, [total]);

  const isResponsive = window.innerWidth < 768;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingCart size={36} color="#2563eb" />
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Quick Order</h1>
            <p style={{ color: '#6b7280' }}>Add products to your cart and checkout quickly</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: window.innerWidth < 1024 ? 'column' : 'row', gap: '32px' }}>
          {/* Left Column - Quick Order Form */}
          <div style={{ flex: '1' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} />
                Add Products
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: isResponsive ? '1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                {/* Product Input with Autocomplete */}
                <div style={{ gridColumn: isResponsive ? 'span 1' : 'span 2', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Product Code / Name
                  </label>
                  <input
                    type="text"
                    value={productInput}
                    onChange={(e) => {
                      setProductInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Search products..."
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && productInput && filteredSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      zIndex: 10,
                      width: '100%',
                      marginTop: '4px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      maxHeight: '192px',
                      overflowY: 'auto'
                    }}>
                      {filteredSuggestions.map((product, index) => (
                        <div
                          key={index}
                          onClick={() => handleProductSelect(product)}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #f3f4f6' : 'none'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          {product}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Unit Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="piece">Piece</option>
                    <option value="box">Box</option>
                    <option value="meter">Meter</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddProduct}
                style={{
                  width: isResponsive ? '100%' : 'auto',
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Add to Order
              </button>
            </div>

            {/* Order Items Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Order Items</h3>
              
              {orderItems.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>No items added yet</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '500', color: '#374151' }}>Product</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '500', color: '#374151' }}>Qty</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '500', color: '#374151' }}>Unit</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '500', color: '#374151' }}>Price</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '500', color: '#374151' }}>Total</th>
                        <th style={{ width: '32px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 8px', fontSize: '14px', color: '#111827' }}>{item.product}</td>
                          <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6b7280' }}>{item.quantity}</td>
                          <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>{item.unit}</td>
                          <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6b7280' }}>${item.price}</td>
                          <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>${item.total}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              style={{
                                color: '#ef4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                              onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Upload CSV/Excel */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Bulk Upload</h3>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center'
              }}>
                <Upload style={{ margin: '0 auto 16px', color: '#9ca3af' }} size={48} />
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>Upload CSV or Excel file</p>
                <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>Drag and drop or click to browse</p>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Card */}
          <div style={{ width: window.innerWidth < 1024 ? '100%' : '384px' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '24px',
              position: window.innerWidth >= 1024 ? 'sticky' : 'static',
              top: '16px'
            }}>
              {/* Payment Method Selection */}
              {orderItems.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={20} />
                    Payment Method
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div 
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: selectedPaymentMethod === 'paypal' ? '2px solid #2563eb' : '1px solid #d1d5db',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: selectedPaymentMethod === 'paypal' ? '#eff6ff' : 'white'
                      }}
                      onClick={() => setSelectedPaymentMethod('paypal')}
                    >
                      <img 
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                        alt="PayPal" 
                        style={{ height: '20px', marginBottom: '8px' }}
                      />
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>PayPal</div>
                    </div>
                    
                    <div 
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: selectedPaymentMethod === 'card' ? '2px solid #2563eb' : '1px solid #d1d5db',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: selectedPaymentMethod === 'card' ? '#eff6ff' : 'white',
                        opacity: 0.5
                      }}
                      onClick={() => {
                        // Kart ödemesi şu anda devre dışı
                        setPaymentError('Credit card payments are temporarily unavailable. Please use PayPal.');
                      }}
                    >
                      <CreditCard size={20} style={{ marginBottom: '8px', display: 'block', margin: '0 auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>Credit Card</div>
                    </div>
                  </div>
                  
                  {paymentError && (
                    <div style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '8px',
                      border: '1px solid #fecaca'
                    }}>
                      <AlertCircle size={16} />
                      {paymentError}
                    </div>
                  )}
                  
                  {paymentSuccess && (
                    <div style={{
                      color: '#16a34a',
                      fontSize: '14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <Check size={16} />
                      Payment successful! Your order has been received.
                    </div>
                  )}
                  
                  {/* PayPal Buton Container */}
                  {selectedPaymentMethod === 'paypal' && orderItems.length > 0 && (
                    <div>
                      <div ref={paypalButtonsRef}></div>
                      <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '12px' }}>
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Summary */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Order Summary</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                    <span style={{ color: '#6b7280' }}>Items ({orderItems.length})</span>
                    <span style={{ color: '#111827' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#6b7280' }}>Discount (10%)</span>
                      <span style={{ color: '#16a34a' }}>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                    <span style={{ color: '#6b7280' }}>Delivery</span>
                    <span style={{ color: '#111827' }}>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '18px' }}>
                      <span style={{ color: '#111827' }}>Total</span>
                      <span style={{ color: '#111827' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {orderItems.length === 0 && (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <ShoppingCart size={24} style={{ marginBottom: '12px', display: 'block', margin: '0 auto' }} />
                  <p>Add items to your cart to see payment options</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickOrder;
