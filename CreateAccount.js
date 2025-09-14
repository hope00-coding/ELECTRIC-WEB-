import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Hesap oluşturuluyor:', formData);
    // App.js'e yönlendirme
    navigate('/');
  };

  const handleBackToHome = () => {
    // App.js'e yönlendirme
    navigate('/');
  };

  const handleLoginRedirect = () => {
    // Login.js sayfasına yönlendirme
    navigate('/signin');
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 48px 16px 16px',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '2px solid #334155',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const focusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #0f172a 100%)',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Sol Taraf - Hero Section */}
      <div style={{
        width: '50%',
        padding: '60px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
        `,
        position: 'relative'
      }}>
        <div style={{ maxWidth: '500px', color: 'white' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px'
          }}>
            JOIN FOR FREE
          </div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px'
          }}>
            Unleash the traveler{' '}
            <span style={{ color: '#60a5fa' }}>inside YOU</span>, Enjoy your Dream Vacation
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#cbd5e1',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Get Started with the easiest and most secure website to buy travel tickets.
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{
              padding: '12px 32px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: 'white',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}>
              Explore more
            </button>
            
            <button style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            }}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form Section */}
      <div style={{
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative'
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '48px'
          }}>
            <button 
              type="button"
              onClick={handleBackToHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              ← Ana Sayfaya Dön
            </button>
            
            <div style={{ fontSize: '24px', fontWeight: '800' }}>
              <span style={{ color: '#60a5fa' }}>karaköy</span>
              <span style={{ color: 'white' }}>spot</span>
            </div>
          </div>

          {/* Form Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '8px'
            }}>
              Create new account
            </h1>
          </div>

          {/* Name Fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ad"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#334155';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <User style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                width: '20px',
                height: '20px'
              }} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Soyad"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#334155';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <User style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                width: '20px',
                height: '20px'
              }} />
            </div>
          </div>

          {/* Phone Field */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <Phone style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Telefon Numarası"
              required
              style={{
                ...inputStyle,
                paddingLeft: '48px'
              }}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#334155';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <Mail style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="E-posta Adresi"
              required
              style={{
                ...inputStyle,
                paddingLeft: '48px'
              }}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#334155';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '32px', position: 'relative' }}>
            <Lock style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              width: '20px',
              height: '20px'
            }} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Şifre"
              required
              style={{
                ...inputStyle,
                paddingLeft: '48px'
              }}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#334155';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            }}
          >
            Create Account
          </button>

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#94a3b8' }}>
              Already A Member?{' '}
              <button 
                type="button"
                onClick={handleLoginRedirect}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#60a5fa',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
              >
                Log In
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}