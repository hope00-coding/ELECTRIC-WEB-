import React, { useState, useEffect } from 'react';

const Sepet = ({ cartItems: externalCartItems, onUpdateCart }) => {
  // External cartItems'ı kullan, yoksa localStorage'dan al
  const [cartItems, setCartItems] = useState(() => {
    if (externalCartItems && externalCartItems.length > 0) {
      return externalCartItems;
    }
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // External cartItems değiştiğinde local state'i güncelle
  useEffect(() => {
    if (externalCartItems) {
      setCartItems(externalCartItems);
    }
  }, [externalCartItems]);

  const [currentVATNumber] = useState(`VAT${Math.floor(Math.random() * 1000000)}`);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: 'Simon Petrikow',
    cardNumber: '1234 5678 2385 2496',
    expiryDate: '10/25',
    cvv: '600'
  });
  const [savePaymentDetails, setSavePaymentDetails] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    
    // Parent component'e güncellemeyi bildir
    if (onUpdateCart) {
      onUpdateCart(updatedItems);
    }
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    // Parent component'e güncellemeyi bildir
    if (onUpdateCart) {
      onUpdateCart(updatedItems);
    }
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  };

  // Teslimat tarihini hesapla (3-4 gün sonra, hafta sonu hariç)
  const getDeliveryDate = () => {
    const today = new Date();
    let daysToAdd = Math.floor(Math.random() * 2) + 3;
    let deliveryDate = new Date(today);
    
    while (daysToAdd > 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        daysToAdd--;
      }
    }
    
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const randomHour = Math.floor(Math.random() * 9) + 9;
    
    return `${days[deliveryDate.getDay()]} ${String(randomHour).padStart(2, '0')}:00-${String(randomHour + 1).padStart(2, '0')}:00`;
  };

  // PO numarası oluştur
  const generatePONumber = () => {
    const now = new Date();
    return `PO${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const formatPrice = (price) => {
    return `₺${price.toLocaleString('tr-TR')}`;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 29;
  const vatRate = 0.21;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + shippingCost + vatAmount;

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmOrder = () => {
    const newVATNumber = `VAT${Math.floor(Math.random() * 1000000)}`;
    
    if (!savePaymentDetails) {
      setPaymentInfo({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
    }
    
    alert(`Siparişiniz onaylandı! Fatura mailinize gönderildi ve SMS olarak ${newVATNumber} takip numarası ile 10 dakika içinde size ulaştırılmıştır.`);
  };

  const paymentMethods = [
    { 
      id: 'credit-card', 
      name: 'Credit Card', 
      icon: '💳'
    },
    { 
      id: 'bank-card', 
      name: 'Bank Card', 
      icon: '🏦'
    },
    { 
      id: 'apple-pay', 
      name: 'Apple Pay', 
      icon: '🍎'
    },
    { 
      id: 'google-pay', 
      name: 'Google Pay', 
      icon: '📱'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: '💙'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
      padding: '20px 0'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', letterSpacing: '-1px' }}>
            <span style={{ color: '#dc2626' }}>karaköy</span>
            <span style={{ color: 'black' }}>spot</span>
          </div>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <button 
              onClick={() => window.history.back()}
              style={{ 
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Ana Sayfa
            </button>
            <span>›</span>
            <span>Sepetim</span>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 20px'
      }}>
        <h1 style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '30px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Sepetim ({cartItems.length} Ürün)
        </h1>

        {cartItems.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ fontSize: '24px', color: '#374151', marginBottom: '10px' }}>
              Sepetiniz Boş
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '30px' }}>
              Alışverişe başlamak için ürünleri sepete ekleyin
            </p>
            <button 
              onClick={() => window.history.back()}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Alışverişe Başla
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: '30px'
          }}>
            {/* Sol Taraf - Sepet Ürünleri */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <div style={{
                padding: '25px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151' }}>
                  Sepetteki Ürünler
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#6b7280',
                  flexWrap: 'wrap'
                }}>
                  <span>VAT Number:</span>
                  <span style={{ fontWeight: '600', color: '#374151' }}>{currentVATNumber}</span>
                  <span style={{ marginLeft: isMobile ? '0' : '20px' }}>PO Number:</span>
                  <span style={{ fontWeight: '600', color: '#374151' }}>{generatePONumber()}</span>
                </div>
              </div>

              <div style={{ padding: '0' }}>
                {cartItems.map((item, index) => (
                  <div key={item.id} style={{
                    padding: '25px',
                    borderBottom: index !== cartItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: isMobile ? 'wrap' : 'nowrap'
                  }}>
                    {/* Ürün Resmi */}
                    <div style={{
                      width: isMobile ? '80px' : '100px',
                      height: isMobile ? '80px' : '100px',
                      backgroundColor: item.bgColor || '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '24px' : '32px',
                      flexShrink: 0
                    }}>
                      {item.image || '📦'}
                    </div>

                    {/* Ürün Bilgileri */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <h3 style={{
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                        lineHeight: '1.4'
                      }}>
                        {item.name}
                      </h3>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {item.brand} • {item.category}
                      </div>
                      <div style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: 'bold',
                        color: '#dc2626'
                      }}>
                        {formatPrice(item.price)}
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                            textDecoration: 'line-through',
                            marginLeft: '8px',
                            fontWeight: 'normal'
                          }}>
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Miktar ve Silme */}
                    <div style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'row' : 'row',
                      alignItems: 'center',
                      gap: '15px',
                      justifyContent: isMobile ? 'space-between' : 'flex-end',
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      {/* Miktar Kontrolü */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          −
                        </button>
                        <span style={{
                          minWidth: '32px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Silme Butonu */}
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#fee2e2',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#dc2626',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🗑️
                      </button>

                      {/* Toplam Fiyat */}
                      <div style={{
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: 'bold',
                        color: '#374151',
                        minWidth: '80px',
                        textAlign: 'right'
                      }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Taraf - Ödeme Bilgileri */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Ödeme Yöntemi */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '20px'
                }}>
                  Payment method
                </h3>

                {/* Ödeme Yöntemleri */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '25px',
                  flexWrap: 'wrap'
                }}>
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: selectedPaymentMethod === method.id ? '#1a73e8' : '#f3f4f6',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: selectedPaymentMethod === method.id ? 'white' : '#6b7280',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        border: selectedPaymentMethod === method.id ? '2px solid #1a73e8' : '1px solid #e5e7eb',
                        textAlign: 'center',
                        minHeight: '45px',
                        minWidth: '50px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ marginBottom: '2px', fontSize: '16px' }}>
                        {method.icon}
                      </div>
                      <div style={{ fontSize: '8px', textAlign: 'center', lineHeight: '1' }}>
                        {method.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kart Sahibi Adı */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Cardholder name
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#f9fafb',
                      color: '#374151',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Kart Numarası, Tarih ve CCV */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr auto auto',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Card number
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Date
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                      style={{
                        width: isMobile ? '100%' : '80px',
                        padding: '12px 15px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      CCV ?
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                      style={{
                        width: isMobile ? '100%' : '70px',
                        padding: '12px 15px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Checkbox'lar */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#6b7280',
                    cursor: 'pointer',
                    lineHeight: '1.4'
                  }}>
                    <input 
                      type="checkbox" 
                      style={{ 
                        marginTop: '2px',
                        flexShrink: 0
                      }} 
                    />
                    <span>Credit Card payments may take up to 24h to be processed</span>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#6b7280',
                    cursor: 'pointer',
                    lineHeight: '1.4'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={savePaymentDetails}
                      onChange={(e) => setSavePaymentDetails(e.target.checked)}
                      style={{ 
                        marginTop: '2px',
                        flexShrink: 0
                      }} 
                    />
                    <span>Save my payment details for future purchases</span>
                  </label>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '12px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      lineHeight: '1.4',
                      flex: '1'
                    }}>
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        style={{ 
                          marginTop: '2px',
                          flexShrink: 0
                        }} 
                      />
                      <span>Enable recurring payments</span>
                    </label>
                    <span style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      Highly recommended
                    </span>
                  </div>

                  <p style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    lineHeight: '1.4',
                    margin: '10px 0 0 0'
                  }}>
                    Never run out of balance when sending your campaigns! You can change these settings on your financial preferences anytime.
                  </p>
                </div>
              </div>

              {/* Sipariş Özeti */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '20px'
                }}>
                  Order Summary
                </h3>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>Balance amount:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>Kargo & Taşıma Ücreti:</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    {formatPrice(shippingCost)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>
                    VAT (21%) ?
                  </span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    {formatPrice(vatAmount)}
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '20px 0' }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  <span style={{ color: '#374151' }}>Total:</span>
                  <span style={{ color: '#374151' }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '20px'
                }}>
                  (incl. VAT)
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '12px',
                  color: '#374151',
                  lineHeight: '1.4'
                }}>
                  <strong>Account after topping</strong><br />
                  Needle Marketing
                  <div style={{ color: '#22c55e', fontWeight: '600' }}>{formatPrice(total)}</div>
                </div>

                <button 
                  onClick={handleConfirmOrder}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Confirm your order
                </button>

                <div style={{
                  textAlign: 'center',
                  marginTop: '15px'
                }}>
                  <button 
                    onClick={() => window.history.back()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1a73e8',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ← Return to add funds
                  </button>
                </div>

                {/* Alt kısım - Message info */}
                <div style={{
                  marginTop: '25px',
                  padding: '15px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      Teslimat
                    </div>
                    <span style={{ fontWeight: '600', color: '#374151' }}>
                      {getDeliveryDate()}
                    </span>
                  </div>
                  <p style={{ margin: 0 }}>
                    Fatura mailinize gönderildi ve size SMS olarak {currentVATNumber} ürün takip numarası ile 10 dakika içinde atılmış olacaktır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sepet;