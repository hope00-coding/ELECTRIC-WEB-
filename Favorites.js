import React, { useState, useEffect, useCallback } from 'react';

// Yardımcı fonksiyonlar
const formatPrice = (price) => {
  return `₺${price.toLocaleString('tr-TR')}`;
};

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < rating ? '#fbbf24' : '#e5e7eb', fontSize: '14px' }}>★</span>
  ));
};

// Ana bileşen
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Pencere boyutunu izleme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Favorileri yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(savedFavorites);
    }
  }, []);

  // Favorilerdeki her ürün için varsayılan miktar 1 olarak ayarla
  useEffect(() => {
    const initialQuantities = {};
    favorites.forEach(product => {
      if (!quantities[product.id]) {
        initialQuantities[product.id] = 1;
      }
    });
    if (Object.keys(initialQuantities).length > 0) {
      setQuantities(prev => ({ ...prev, ...initialQuantities }));
    }
  }, [favorites]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    }
  }, []);

  // Sepete ekleme fonksiyonu - güncellenmiş versiyon
  const addToCart = useCallback((product) => {
    const quantity = quantities[product.id] || 1;
    
    if (typeof window !== 'undefined') {
      // Mevcut sepeti al
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Ürün zaten sepette var mı kontrol et
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Ürün zaten sepette var, miktarını güncelle
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Yeni ürün ekle
        currentCart.push({
          ...product,
          quantity: quantity
        });
      }
      
      // Sepeti kaydet
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      // Sepete eklendi mesajı göster
      alert(`${product.name} sepete eklendi! (Miktar: ${quantity})`);
      
      // Sepet sayfasına yönlendir
      setTimeout(() => {
        window.location.href = '/Sepet'; // Senin sepet sayfan URL'ini buraya yaz
        // Alternatifler:
        // window.location.href = '/cart';
        // window.location.href = '/Sepet';
      }, 1000); // 1 saniye bekle sonra yönlendir
    }
  }, [quantities]);

  const removeFromFavorites = useCallback((product) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== product.id);
    setFavorites(updatedFavorites);
    
    // localStorage'ı güncelle
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    
    // Miktar bilgisini de temizle
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[product.id];
      return newQuantities;
    });
  }, [favorites]);

  const navigateToHome = () => {
    // Ana sayfaya yönlendirme işlemi
    if (typeof window !== 'undefined') {
      window.location.href = '/'; // Ana sayfaya yönlendir
    }
  };

  const navigateToCart = () => {
    // Sepet sayfasına yönlendirme işlemi
    if (typeof window !== 'undefined') {
      // Farklı URL seçenekleri - hangisi doğruysa onu kullan:
      window.location.href = '/sepet';     // Seçenek 1
      // window.location.href = '/cart';   // Seçenek 2
      // window.location.href = '/Sepet';  // Seçenek 3
      // window.location.href = './Sepet.js'; // Seçenek 4
    }
  };

  // Boş favori listesi görünümü
  if (!favorites || favorites.length === 0) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '80px', 
          marginBottom: '20px',
          opacity: '0.3'
        }}>💔</div>
        <h2 style={{ 
          fontSize: isMobile ? '24px' : '32px',
          color: '#374151',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>
          Favoriler Listeniz Boş
        </h2>
        <p style={{ 
          fontSize: isMobile ? '16px' : '18px',
          color: '#6b7280',
          marginBottom: '30px',
          maxWidth: '500px',
          lineHeight: '1.6'
        }}>
          Henüz hiç ürün favorilere eklenmemiş. Beğendiğiniz ürünlerin kalp ikonuna tıklayarak favoriler listenize ekleyebilirsiniz.
        </p>
        <button 
          onClick={navigateToHome}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Favoriler
            </h1>
            <p style={{ 
              fontSize: isMobile ? '14px' : '16px',
              color: '#6b7280',
              margin: 0
            }}>
              {favorites.length} ürün favorilerde
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={navigateToCart}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: isMobile ? '10px 16px' : '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              🛒 Sepete Git
            </button>
            
            <button 
              onClick={navigateToHome}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: isMobile ? '10px 16px' : '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              ← Ana Sayfaya Dön
            </button>
          </div>
        </div>

        {/* Favorites Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '15px' : '20px'
        }}>
          {favorites.map((product) => (
            <FavoriteProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.id] || 1}
              isMobile={isMobile}
              updateQuantity={updateQuantity}
              addToCart={addToCart}
              removeFromFavorites={removeFromFavorites}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Ürün kartı bileşeni
const FavoriteProductCard = ({ 
  product, 
  quantity, 
  isMobile, 
  updateQuantity, 
  addToCart, 
  removeFromFavorites 
}) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
      }}
    >
      {/* Favorilerden Çıkar Butonu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFromFavorites(product);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(220, 38, 38, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 2,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(185, 28, 28, 0.9)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
          e.target.style.transform = 'scale(1)';
        }}
        title="Favorilerden Çıkar"
      >
        🗑️
      </button>

      {/* Ürün Resmi */}
      <div style={{
        height: isMobile ? '150px' : '180px',
        width: '100%',
        backgroundColor: product.bgColor || '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          fontSize: isMobile ? '40px' : '50px',
          opacity: '0.8'
        }}>
          {product.image || '📦'}
        </div>
      </div>

      {/* Ürün Bilgileri */}
      <div style={{ padding: isMobile ? '15px' : '20px' }}>
        <h3 style={{
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 10px 0',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: isMobile ? '40px' : '44px'
        }}>
          {product.name || 'Ürün Adı'}
        </h3>

        {/* Rating */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {renderStars(product.rating || 0)}
          </div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            ({product.reviews || 0})
          </span>
        </div>

        {/* Fiyat */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '4px'
          }}>
            {formatPrice(product.price || 0)}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              textDecoration: 'line-through'
            }}>
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>

        {/* Miktar Kontrolü */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '15px',
          padding: '8px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#374151',
            minWidth: '45px'
          }}>
            Miktar:
          </span>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '4px'
          }}>
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: quantity <= 1 ? '#9ca3af' : '#374151',
                opacity: quantity <= 1 ? 0.5 : 1
              }}
            >
              -
            </button>
            
            <span style={{ 
              minWidth: '40px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              {quantity}
            </span>
            
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#374151'
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Sepete Ekle Butonu */}
        <button 
          onClick={() => addToCart(product)}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#b91c1c';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span>🛒</span>
          Sepete Ekle ({quantity} adet)
        </button>
      </div>
    </div>
  );
};

export default Favorites;