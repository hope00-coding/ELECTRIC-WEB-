import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CreateAccount from './CreateAccount.js';
import Login from './Login.js';
import QuickOrder from './quickorder.js';
import Favorites from './Favorites';
import Sepet from './sepet';

const KarakoyspotClone = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBrand, setCurrentBrand] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const brandsContainerRef = useRef(null);
  const categoriesContainerRef = useRef(null);



const [favorites, setFavorites] = useState(() => {
  if (typeof window !== 'undefined') {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  }
  return [];
});




// MEVCUT favorites state'inden sonra EKLE:
const [cartItems, setCartItems] = useState(() => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
});








// EKLE:
const addToCart = (product) => {
  setCartItems(prev => {
    const existingItem = prev.find(item => item.id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = prev.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...prev, { ...product, quantity: 1 }];
    }
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
    
    return newCart;
  });
};















// Mevcut toggleFavorite fonksiyonunu şu şekilde değiştirin:

const toggleFavorite = (product) => {
  setFavorites(prev => {
    const isAlreadyFavorite = prev.find(fav => fav.id === product.id);
    let newFavorites;
    
    if (isAlreadyFavorite) {
      newFavorites = prev.filter(fav => fav.id !== product.id);
    } else {
      newFavorites = [...prev, product];
    }
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
    
    return newFavorites;
  });
};






const isFavorite = (productId) => {
  return favorites.some(fav => fav.id === productId);
};



  

  // Otomatik slider için useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Otomatik marka kayması için useEffect
  useEffect(() => {
    const brandInterval = setInterval(() => {
      setCurrentBrand(prev => (prev + 1) % brands.length);
      
      if (brandsContainerRef.current) {
        const container = brandsContainerRef.current;
        const scrollAmount = 100;
        container.scrollLeft += scrollAmount;
        
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollLeft = 0;
        }
      }
    }, 5000);
    
    return () => clearInterval(brandInterval);
  }, []);

  // Otomatik kategori kayması için useEffect
  useEffect(() => {
    const categoryInterval = setInterval(() => {
      if (categoriesContainerRef.current) {
        const container = categoriesContainerRef.current;
        const scrollAmount = 100;
        container.scrollLeft += scrollAmount;
        
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollLeft = 0;
        }
      }
    }, 6000);
    
    return () => clearInterval(categoryInterval);
  }, []);

  // Filtreleme ve sıralama için useEffect
  useEffect(() => {
    let filtered = [...sampleProducts];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => selectedColors.includes(product.color));
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    switch (sortOption) {
      case 'lowest':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'highest':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, selectedColors, selectedBrands, sortOption, searchQuery]);

  const sliderContent = [
    { title: "Mobil Uygulamayı indir,", subtitle: "avantajlı fiyatlar anında", highlight: "cebine gelsin!" },
    { title: "Hızlı Teslimat", subtitle: "24 saat içinde", highlight: "kapında!" },
    { title: "Güvenli Alışveriş", subtitle: "SSL sertifikası ile", highlight: "güvende!" },
    { title: "Ücretsiz Kargo", subtitle: "150₺ üzeri alışverişlerde", highlight: "bedava!" },
    { title: "Kaliteli Ürünler", subtitle: "en iyi markalardan", highlight: "seçtik!" }
  ];

  const brands = [
    { name: "Nexans", bgColor: "#dc2626", color: "white" },
    { name: "neteisan", bgColor: "#dc2626", color: "white" },
    { name: "Multisan", bgColor: "#991b1b", color: "white" },
    { name: "MAKEL", bgColor: "#dc2626", color: "white" },
    { name: "legrand", bgColor: "#dc2626", color: "white" },
    { name: "HIES", bgColor: "#2563eb", color: "white" },
    { name: "GÜNSAN", bgColor: "#ea580c", color: "white" },
    { name: "ELB", bgColor: "#dc2626", color: "white" },
    { name: "ÇATA", bgColor: "#1f2937", color: "white" },
    { name: "AUDIO", bgColor: "#dc2626", color: "white" },
    { name: "ALTIN KABLO", bgColor: "#d4af37", color: "white" },
    { name: "ABB", bgColor: "#dc2626", color: "white" },
    { name: "LED", bgColor: "#ea580c", color: "white" }
  ];

  const categories = [
    { name: 'Enerji Kablosu', icon: '⚡' },
    { name: 'Sigorta/Salt', icon: '🔌' },
    { name: 'Hırdavat/Makine', icon: '🔧' },
    { name: 'Fiş ve Aksesuarlar', icon: '🔌' },
    { name: 'Elektrikli Araç Şarj İstasyonu', icon: '🔋' },
    { name: 'Aydınlatma', icon: '💡' },
    { name: 'Diafon Sistemleri', icon: '📞' },
    { name: 'Anahtar/Grup Priz', icon: '🔦' },
    { name: 'Elektrik ve Tesisat', icon: '🏠' }
  ];

  const filterBrands = [
    'Nexans', 'Neteisan', 'Multisan', 'MAKEL', 
    'Legrand', 'HIES', 'GÜNSAN', 'ELB', 
    'ÇATA', 'AUDIO', 'ALTIN KABLO', 'ABB'
  ];

  const colors = [
    { name: 'Mavi', value: '#3b82f6' },
    { name: 'Sarı-Yeşil', value: '#22c55e' },
    { name: 'Kırmızı', value: '#dc2626' },
    { name: 'Siyah', value: '#1f2937' },
    { name: 'Beyaz', value: '#f9fafb' },
    { name: 'Gri', value: '#6b7280' }
  ];

  const sampleProducts = [
    {
      id: 1,
      name: "Viko 63A Otomatik Sigorta",
      price: 4200,
      originalPrice: 4500,
      rating: 5,
      reviews: 12,
      image: "🔲",
      bgColor: "#f3f4f6",
      category: "Sigorta/Salt",
      brand: "Viko",
      color: "Beyaz",
      isBestSeller: true
    },
    {
      id: 2,
      name: "Öznur 1.5 NYA Kablo (Mavi)",
      price: 607,
      originalPrice: 650,
      rating: 4,
      reviews: 8,
      image: "🔵",
      bgColor: "#3b82f6",
      category: "Enerji Kablosu",
      brand: "Öznur",
      color: "Mavi",
      isBestSeller: true
    },
    {
      id: 3,
      name: "Öznur 2.5 NYA Kablo (Mavi)",
      price: 967,
      originalPrice: 1000,
      rating: 5,
      reviews: 15,
      image: "🔵",
      bgColor: "#3b82f6",
      category: "Enerji Kablosu",
      brand: "Öznur",
      color: "Mavi",
      isBestSeller: true
    },
    {
      id: 4,
      name: "Prysmian 3x2.5 NHXMH Kablo (Gri) NYM YANMAZ",
      price: 3602,
      originalPrice: 3800,
      rating: 5,
      reviews: 25,
      image: "⚫",
      bgColor: "#6b7280",
      category: "Enerji Kablosu",
      brand: "Prysmian",
      color: "Gri",
      isBestSeller: true
    },
    {
      id: 5,
      name: "Öznur 2.5 NYA Kablo (Sarı-Yeşil)",
      price: 967,
      originalPrice: 1000,
      rating: 4,
      reviews: 7,
      image: "🟢",
      bgColor: "#22c55e",
      category: "Enerji Kablosu",
      brand: "Öznur",
      color: "Sarı-Yeşil",
      isBestSeller: false
    },
    {
      id: 6,
      name: "MAKEL 25A Kompakt Şalter",
      price: 850,
      originalPrice: 900,
      rating: 4,
      reviews: 6,
      image: "⚡",
      bgColor: "#f59e0b",
      category: "Sigorta/Salt",
      brand: "MAKEL",
      color: "Sarı",
      isBestSeller: false
    },
    {
      id: 7,
      name: "Viko Kare Serisi Priz",
      price: 1250,
      originalPrice: 1400,
      rating: 5,
      reviews: 18,
      image: "🔌",
      bgColor: "#f3f4f6",
      category: "Anahtar/Grup Priz",
      brand: "Viko",
      color: "Beyaz",
      isBestSeller: false
    },
    {
      id: 8,
      name: "Schneider Electric Anahtar",
      price: 850,
      originalPrice: 950,
      rating: 4,
      reviews: 9,
      image: "🔘",
      bgColor: "#3b82f6",
      category: "Anahtar/Grup Priz",
      brand: "Schneider",
      color: "Mavi",
      isBestSeller: false
    }
  ];

  const bestSellerProducts = sampleProducts.filter(product => product.isBestSeller).slice(0, 4);

  const services = [
    { 
      title: "Kapsayıcı Kargo", 
      description: "150₺ ve üzeri alışverişlerde ücretsiz kargo",
      icon: "🚚"
    },
    { 
      title: "Güvenli Ödeme", 
      description: "256-bit SSL ile güvenli ödeme",
      icon: "🔒"
    },
    { 
      title: "En İyi Fiyatlar", 
      description: "En uygun fiyat garantisi",
      icon: "💰"
    },
    { 
      title: "7/24 Ulaşım Hattı", 
      description: "Müşteri hizmetleri 7/24 hizmetinizde",
      icon: "📞"
    }
  ];

  const handleColorToggle = (colorName) => {
    setSelectedColors(prev => 
      prev.includes(colorName) 
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSortOption('default');
    setSearchQuery('');
  };

  const applyFilters = () => {
    console.log('Filters applied:', {
      category: selectedCategory,
      priceRange,
      colors: selectedColors,
      brands: selectedBrands,
      sortOption
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const toggleDropdown = (menu) => {
    setIsDropdownOpen(prev => prev === menu ? null : menu);
  };

  const formatPrice = (price) => {
    return `₺${price.toLocaleString('tr-TR')}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#e5e7eb', fontSize: '14px' }}>★</span>
    ));
  };

  const productsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
  const handleStorageChange = () => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);






  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', paddingTop: isMobile ? '120px' : '180px' }}>
        <header style={{ 
          backgroundColor: 'white', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0' }}>
              {isMobile && (
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '24px', 
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  ☰
                </button>
              )}

              <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', letterSpacing: '-1px' }}>
                <span style={{ color: '#dc2626' }}>karaköy</span>
                <span style={{ color: 'black' }}>spot</span>
              </div>

              {!isMobile && (
                <form onSubmit={handleSearch} style={{ flex: '1', maxWidth: '500px', margin: '0 50px', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Please enter some search keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px 0 0 8px',
                      outline: 'none',
                      fontSize: '15px',
                      borderRight: 'none'
                    }}
                  />
                  <button type="submit" style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '100%',
                    padding: '0 20px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 8px 8px 0',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}>
                    🔍
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '25px' }}>
  <Link to="/login" style={{ 
    padding: isMobile ? '6px 12px' : '8px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600'
  }}>
    Giriş
  </Link>





    
  

<Link to="/favorites" style={{ textDecoration: 'none' }}>
  <div style={{ position: 'relative', cursor: 'pointer' }}>
    <span style={{ fontSize: isMobile ? '20px' : '24px' }}>❤️</span>
    {favorites.length > 0 && (
      <span style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#dc2626',
        color: 'white',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>{favorites.length}</span>
    )}
  </div>
</Link>













                <Link to="/sepet" style={{ textDecoration: 'none' }}>
  <div style={{ position: 'relative', cursor: 'pointer' }}>
    <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🛒</span>
    {cartItems.length > 0 && (
      <span style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#dc2626',
        color: 'white',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
    )}
  </div>
</Link>
              </div>
            </div>

            {isMobile && (
              <form onSubmit={handleSearch} style={{ marginBottom: '10px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Please enter some search keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px 0 0 8px',
                    outline: 'none',
                    fontSize: '14px',
                    borderRight: 'none'
                  }}
                />
                <button type="submit" style={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  height: '100%',
                  padding: '0 15px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
                  🔍
                </button>
              </form>
            )}

            {(!isMobile || isMobileMenuOpen) && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isMobile ? 'flex-start' : 'space-between', 
                padding: '10px 0', 
                borderTop: '1px solid #f3f4f6',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '15px' : '0'
              }}>
                <Link to="/quick-order" style={{
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '15px',
  width: isMobile ? '100%' : 'auto',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center'
}}>
  Quick order
</Link>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: isMobile ? '15px' : '40px',
                  flexDirection: isMobile ? 'column' : 'row',
                  width: isMobile ? '100%' : 'auto'
                }}>
                  {['Hırdavat/Makine', 'Sigorta/salt', 'Enerji Kablosu', 'Diafon Sistemleri', 'Aydınlatma', 'Anahtar/Group Priz'].map((item, index) => (
                    <div key={index} style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          cursor: 'pointer', 
                          fontSize: isMobile ? '16px' : '15px', 
                          fontWeight: '500',
                          padding: isMobile ? '10px 0' : '0',
                          borderBottom: isMobile ? '1px solid #f3f4f6' : 'none'
                        }}
                        onClick={() => toggleDropdown(item)}
                      >
                        <span>{item}</span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>▼</span>
                      </div>
                      
                      {isDropdownOpen === item && (
                        <div style={{
                          position: isMobile ? 'static' : 'absolute',
                          top: isMobile ? 'auto' : '100%',
                          left: isMobile ? 'auto' : 0,
                          backgroundColor: 'white',
                          boxShadow: isMobile ? 'none' : '0 4px 15px rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          padding: '10px',
                          minWidth: isMobile ? '100%' : '200px',
                          zIndex: 1000,
                          marginTop: isMobile ? '10px' : '0'
                        }}>
                          {['Alt Kategori 1', 'Alt Kategori 2', 'Alt Kategori 3'].map((subItem, subIndex) => (
                            <div key={subIndex} style={{ 
                              padding: '8px 12px', 
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}>
                              {subItem}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '40px', padding: '10px 0' }}>
                {[ ''].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: '#6b7280' }}>
                    <span>{item}</span>
                    {index < 2 && (
                      <span 
                        style={{ fontSize: '10px' }}
                        onClick={() => toggleDropdown(`sub-${item}`)}
                      >▼</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/login" element={<CreateAccount />} />
          <Route path="/signin" element={<Login />} />  {/* Bu satırı ekleyin */}
          <Route path="/quick-order" element={<QuickOrder />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/sepet" element={<Sepet cartItems={cartItems} onUpdateCart={setCartItems} />} />
         
          
          <Route path="" element={
            <>
              <section style={{ 
                backgroundColor: 'white', 
                padding: isMobile ? '15px 0' : '30px 0', 
                borderBottom: '1px solid #f3f4f6',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{ 
                  maxWidth: '1400px', 
                  margin: '0 auto', 
                  padding: '0 20px',
                  position: 'relative'
                }}>
                  <h2 style={{ 
                    textAlign: 'center', 
                    fontSize: isMobile ? '18px' : '24px', 
                    fontWeight: 'bold', 
                    color: '#374151', 
                    marginBottom: isMobile ? '15px' : '25px' 
                  }}>
                    FEATURED PRODUCTS
                  </h2>
                  
                  <div 
                    ref={brandsContainerRef}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: isMobile ? '15px' : '25px',
                      overflowX: 'auto',
                      padding: isMobile ? '10px 5px' : '15px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {brands.map((brand, index) => (
                      <div
                        key={index}
                        style={{
                          flex: '0 0 auto',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          transform: index === currentBrand ? 'scale(1.1)' : 'scale(1)',
                          filter: index === currentBrand ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                        }}
                      >
                        <div
                          style={{
                            width: isMobile ? '60px' : '80px',
                            height: isMobile ? '60px' : '80px',
                            borderRadius: '50%',
                            backgroundColor: brand.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: brand.color,
                            fontSize: isMobile ? '12px' : '14px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: index === currentBrand ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {brand.name}
                          {index === currentBrand && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
                                pointerEvents: 'none'
                              }}
                            />
                          )}
                        </div>
                        <span style={{ 
                          marginTop: '8px', 
                          fontSize: isMobile ? '10px' : '12px', 
                          fontWeight: '500',
                          textAlign: 'center',
                          maxWidth: isMobile ? '60px' : '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {brand.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section style={{ backgroundColor: '#e5e7eb', padding: isMobile ? '30px 0' : '60px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: isMobile ? '20px' : '40px', 
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? '200px' : '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      opacity: 0.7,
                      zIndex: 1
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h2 style={{ 
                        fontSize: isMobile ? '20px' : '32px', 
                        fontWeight: 'bold', 
                        color: '#374151', 
                        marginBottom: '15px' 
                      }}>
                        {sliderContent[currentSlide].title}
                        <span style={{ color: '#dc2626', display: 'block' }}>
                          {sliderContent[currentSlide].highlight}
                        </span>
                      </h2>
                      <p style={{ 
                        fontSize: isMobile ? '14px' : '18px', 
                        color: '#6b7280', 
                        marginTop: '10px' 
                      }}>
                        {sliderContent[currentSlide].subtitle}
                      </p>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '15px',
                      display: 'flex',
                      gap: '8px',
                      zIndex: 2
                    }}>
                      {sliderContent.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: currentSlide === index ? '#dc2626' : '#e5e7eb',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ backgroundColor: 'white', padding: isMobile ? '30px 0' : '60px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                  <h2 style={{ 
                    textAlign: 'center', 
                    fontSize: isMobile ? '20px' : '24px', 
                    fontWeight: 'bold', 
                    color: '#374151', 
                    marginBottom: isMobile ? '20px' : '30px' 
                  }}>
                    SHOPPING BY CATEGORY
                  </h2>
                  
                  <div 
                    ref={categoriesContainerRef}
                    style={{ 
                      display: 'flex',
                      gap: isMobile ? '15px' : '20px',
                      overflowX: 'auto',
                      padding: isMobile ? '10px 5px' : '15px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {categories.map((category, index) => (
                      <div 
                        key={index}
                        style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: '12px',
                          padding: isMobile ? '15px' : '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: isMobile ? '100px' : '120px',
                          minWidth: isMobile ? '120px' : '150px',
                          flex: '0 0 auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.color = 'inherit';
                        }}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <div style={{
                          width: isMobile ? '40px' : '50px',
                          height: isMobile ? '40px' : '50px',
                          backgroundColor: '#dc2626',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px',
                          color: 'white',
                          fontSize: isMobile ? '18px' : '20px'
                        }}>
                          {category.icon}
                        </div>
                        <span style={{ 
                          fontSize: isMobile ? '12px' : '14px', 
                          fontWeight: '600' 
                        }}>
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section style={{ backgroundColor: '#f9fafb', padding: isMobile ? '20px 0' : '40px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                  <h2 style={{ 
                    textAlign: 'center', 
                    fontSize: isMobile ? '18px' : '22px', 
                    fontWeight: 'bold', 
                    color: '#374151', 
                    marginBottom: isMobile ? '15px' : '25px',
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%'
                  }}>
                    BEST SELLERS
                    <span style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#dc2626',
                      borderRadius: '2px'
                    }}></span>
                  </h2>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? '12px' : '20px'
                  }}>
                    {bestSellerProducts.map((product) => (
                      <div 
                        key={product.id}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '15px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          zIndex: 2
                        }}>
                          Best Seller
                        </div>

                       

                  

<button
  onClick={(e) => {
    e.stopPropagation();
    toggleFavorite(product);
  }}
  style={{
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 3,
    transition: 'all 0.3s ease'
  }}
>
  <span style={{ 
    fontSize: '18px',
    color: isFavorite(product.id) ? '#dc2626' : '#6b7280'
  }}>
    {isFavorite(product.id) ? '❤️' : '🤍'}
  </span>
</button>






                        <div style={{
                          height: isMobile ? '120px' : '150px',
                          width: '100%',
                          backgroundColor: product.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <div style={{
                            fontSize: isMobile ? '30px' : '40px',
                            opacity: '0.8'
                          }}>
                            {product.image}
                          </div>
                        </div>

                        <div style={{ 
                          padding: isMobile ? '10px' : '15px'
                        }}>
                          <h3 style={{
                            fontSize: isMobile ? '12px' : '14px',
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 8px 0',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: isMobile ? '32px' : '40px'
                          }}>
                            {product.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {renderStars(product.rating)}
                            </div>
                            <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#6b7280' }}>
                              ({product.reviews})
                            </span>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            <div>
                              <div style={{
                                fontSize: isMobile ? '14px' : '16px',
                                fontWeight: 'bold',
                                color: '#dc2626',
                                marginBottom: '2px'
                              }}>
                                {formatPrice(product.price)}
                              </div>
                              {product.originalPrice > product.price && (
                                <div style={{
                                  fontSize: isMobile ? '11px' : '12px',
                                  color: '#9ca3af',
                                  textDecoration: 'line-through'
                                }}>
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                            </div>

                            <button 
  onClick={() => addToCart(product)}
  style={{
    padding: isMobile ? '6px 10px' : '8px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#b91c1c';
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = '#dc2626';
  }}>
  {isMobile ? 'Sepet' : 'Sepete Ekle'}
</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section style={{ backgroundColor: 'white', padding: isMobile ? '15px 0' : '25px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                    gap: isMobile ? '15px' : '20px'
                  }}>
                    {services.map((service, index) => (
                      <div 
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          padding: isMobile ? '12px 10px' : '15px 12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          border: '1px solid #e5e7eb',
                          height: 'auto',
                          minHeight: 'auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.color = 'inherit';
                        }}
                      >
                        <div style={{
                          fontSize: isMobile ? '20px' : '24px',
                          marginBottom: '8px'
                        }}>
                          {service.icon}
                        </div>
                        <h3 style={{
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: 'bold',
                          marginBottom: '6px',
                          color: 'inherit'
                        }}>
                          {service.title}
                        </h3>
                        <p style={{
                          fontSize: isMobile ? '10px' : '11px',
                          color: 'inherit',
                          opacity: 0.8,
                          lineHeight: '1.4',
                          margin: 0
                        }}>
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </section>

              <section style={{ backgroundColor: '#f9fafb', padding: isMobile ? '15px 0' : '30px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                  {isMobile && (
                    <div style={{ marginBottom: '15px' }}>
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {isFilterOpen ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                        <span>{isFilterOpen ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '30px', 
                    flexWrap: 'wrap',
                    flexDirection: isMobile && !isFilterOpen ? 'column' : 'row'
                  }}>
                    
                    <div style={{ 
                      flex: isMobile ? '0 0 100%' : '0 0 280px', 
                      backgroundColor: 'white', 
                      borderRadius: '12px', 
                      padding: isMobile ? '15px' : '25px', 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      height: 'fit-content',
                      minWidth: isMobile ? '100%' : '280px',
                      display: isMobile && !isFilterOpen ? 'none' : 'block'
                    }}>
                      <h3 style={{ 
                        fontSize: isMobile ? '18px' : '20px', 
                        fontWeight: 'bold', 
                        color: '#374151', 
                        marginBottom: '20px',
                        borderBottom: '2px solid #f3f4f6',
                        paddingBottom: '10px'
                      }}>
                        Filtreler
                      </h3>

                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                          Kategoriler
                        </h4>
                        <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                          {['Tüm Kategoriler', ...categories.map(c => c.name)].map((category, index) => (
                            <label key={index} style={{ 
                              display: 'block', 
                              marginBottom: '8px', 
                              cursor: 'pointer',
                              padding: '6px 0',
                              fontSize: '14px'
                            }}>
                              <input
                                type="radio"
                                name="category"
                                value={category}
                                checked={selectedCategory === category}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{ marginRight: '8px' }}
                              />
                              {category}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                          Fiyat Aralığı
                        </h4>
                        <div style={{ padding: '10px 0' }}>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            style={{
                              width: '100%',
                              height: '6px',
                              backgroundColor: '#e5e7eb',
                              outline: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                          Renkler
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {colors.map((color, index) => (
                            <button
                              key={index}
                              onClick={() => handleColorToggle(color.name)}
                              style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                backgroundColor: color.value,
                                border: selectedColors.includes(color.name) ? '3px solid #dc2626' : '2px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                              }}
                              title={color.name}
                            >
                              {selectedColors.includes(color.name) && (
                                <span style={{ 
                                  position: 'absolute', 
                                  top: '50%', 
                                  left: '50%', 
                                  transform: 'translate(-50%, -50%)',
                                  color: color.value === '#f9fafb' ? '#374151' : 'white',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}>✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                          Markalar
                        </h4>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {filterBrands.map((brand, index) => (
                            <label key={index} style={{ 
                              display: 'block', 
                              marginBottom: '6px', 
                              cursor: 'pointer',
                              fontSize: '14px',
                              padding: '4px 0'
                            }}>
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandToggle(brand)}
                                style={{ marginRight: '8px' }}
                              />
                              {brand}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                          onClick={clearFilters}
                          style={{
                            padding: '12px 20px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        >
                          Filtreleri Temizle
                        </button>
                        
                        <button
                          onClick={applyFilters}
                          style={{
                            padding: '12px 20px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                          Filtreleri Uygula
                        </button>
                      </div>
                    </div>

                    <div style={{ 
                      flex: '1', 
                      minWidth: isMobile ? '100%' : '300px',
                      display: isMobile && isFilterOpen ? 'none' : 'block'
                    }}>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '25px',
                        backgroundColor: 'white',
                        padding: isMobile ? '12px 15px' : '15px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        flexWrap: 'wrap',
                        gap: '15px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            {filteredProducts.length} ürün bulundu
                          </span>
                          
                          <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="default">Varsayılan sıralama</option>
                            <option value="lowest">En düşük fiyat</option>
                            <option value="highest">En yüksek fiyat</option>
                            <option value="newest">En yeni</option>
                            <option value="popular">En popüler</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setViewMode('grid')}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: viewMode === 'grid' ? '#dc2626' : '#f3f4f6',
                              color: viewMode === 'grid' ? 'white' : '#6b7280',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            ⊞
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: viewMode === 'list' ? '#dc2626' : '#f3f4f6',
                              color: viewMode === 'list' ? 'white' : '#6b7280',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            ☰
                          </button>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'grid' 
                          ? `repeat(auto-fill, minmax(${isMobile ? '140px' : isTablet ? '200px' : '280px'}, 1fr))` 
                          : '1fr',
                        gap: isMobile ? '15px' : '20px'
                      }}>
                        {currentProducts.map((product) => (
                          <div 
                            key={product.id}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '12px',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: viewMode === 'list' ? 'flex' : 'block'
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




                          <button
  onClick={(e) => {
    e.stopPropagation();
    toggleFavorite(product);
  }}
  style={{
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 3,
    transition: 'all 0.3s ease'
  }}
>
  <span style={{ 
    fontSize: '18px',
    color: favorites.find(fav => fav.id === product.id) ? '#dc2626' : '#6b7280'
  }}>
    {favorites.find(fav => fav.id === product.id) ? '❤️' : '🤍'}
  </span>
</button>







                            <div style={{
                              height: viewMode === 'grid' ? (isMobile ? '120px' : isTablet ? '160px' : '220px') : (isMobile ? '100px' : '150px'),
                              width: viewMode === 'list' ? (isMobile ? '100px' : '150px') : '100%',
                              backgroundColor: product.bgColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <div style={{
                                fontSize: viewMode === 'grid' ? (isMobile ? '30px' : isTablet ? '40px' : '60px') : (isMobile ? '30px' : '40px'),
                                opacity: '0.8'
                              }}>
                                {product.image}
                              </div>
                            </div>

                            <div style={{ 
                              padding: isMobile ? '12px' : '20px',
                              flex: viewMode === 'list' ? '1' : 'none'
                            }}>
                              <h3 style={{
                                fontSize: isMobile ? '12px' : '15px',
                                fontWeight: '600',
                                color: '#374151',
                                margin: '0 0 8px 0',
                                lineHeight: '1.4',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {product.name}
                              </h3>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  {renderStars(product.rating)}
                                </div>
                                <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#6b7280' }}>
                                  ({product.reviews})
                                </span>
                              </div>

                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '10px'
                              }}>
                                <div>
                                  <div style={{
                                    fontSize: isMobile ? '14px' : '18px',
                                    fontWeight: 'bold',
                                    color: '#dc2626',
                                    marginBottom: '4px'
                                  }}>
                                    {formatPrice(product.price)}
                                  </div>
                                  {product.originalPrice > product.price && (
                                    <div style={{
                                      fontSize: isMobile ? '12px' : '14px',
                                      color: '#9ca3af',
                                      textDecoration: 'line-through'
                                    }}>
                                      {formatPrice(product.originalPrice)}
                                    </div>
                                  )}
                                </div>

                              <button 
  onClick={() => addToCart(product)}
  style={{
    padding: isMobile ? '6px 10px' : '8px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#b91c1c';
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = '#dc2626';
  }}>
  {isMobile ? 'Sepet' : 'Sepete Ekle'}
</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '40px',
                          flexWrap: 'wrap'
                        }}>
                          <button 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#f3f4f6',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px',
                              opacity: currentPage === 1 ? 0.5 : 1
                            }}
                          >‹</button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: currentPage === page ? '#dc2626' : '#f3f4f6',
                                color: currentPage === page ? 'white' : '#374151',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600'
                              }}
                            >
                              {page}
                            </button>
                          ))}

                          <button 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#f3f4f6',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px',
                              opacity: currentPage === totalPages ? 0.5 : 1
                            }}
                          >›</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <footer style={{ 
                backgroundColor: '#1f2937', 
                color: 'white', 
                padding: isMobile ? '30px 20px' : '50px 20px',
                marginTop: 'auto'
              }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                  

                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                    gap: isMobile ? '25px' : '40px',
                    marginBottom: '30px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#fbbf24' }}>Hakkımızda</h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Şirketimiz</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Misyon & Vizyon</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Kariyer</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>İletişim</a></li>
                      </ul>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#fbbf24' }}>Müşteri Hizmetleri</h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Sıkça Sorulan Sorular</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Kargo ve Teslimat</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>İade ve Değişim</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Gizlilik Politikası</a></li>
                      </ul>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#fbbf24' }}>Kategoriler</h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Enerji Kablosu</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Sigorta/Salt</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Hırdavat/Makine</a></li>
                        <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#e5e7eb', textDecoration: 'none', fontSize: '13px' }}>Aydınlatma</a></li>
                      </ul>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#fbbf24' }}>İletişim</h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span>📍</span> Kemankeş Karamustafa Paşa Mah., Alipaşa Değirmeni Sok. No:3, 34425 Beyoğlu/İstanbul
                        </li>
                        <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span>📞</span> 0850 850 00 00
                        </li>
                        <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span>✉️</span> info@karakoyspot.com
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '15px',
                    marginBottom: '25px'
                  }}>
                    <a href="#" style={{ color: 'white', fontSize: '20px' }}>📱</a>
                    <a href="#" style={{ color: 'white', fontSize: '20px' }}>💬</a>
                    <a href="#" style={{ color: 'white', fontSize: '20px' }}>📸</a>
                    <a href="#" style={{ color: 'white', fontSize: '20px' }}>👥</a>
                  </div>

                  <div style={{ 
                    borderTop: '1px solid #374151', 
                    paddingTop: '15px', 
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#9ca3af'
                  }}>
                    <p>© 2023 KaraköySpot. Tüm hakları saklıdır.</p>
                  </div>
                </div>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default KarakoyspotClone;