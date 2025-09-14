import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Giriş yapılıyor:', formData);
    // Ana sayfaya yönlendirme
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRegisterRedirect = () => {
    navigate('/login'); // CreateAccount sayfasına gidiyor
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
            WELCOME BACK
          </div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px'
          }}>
            Sign in to your{' '}
            <span style={{ color: '#60a5fa' }}>account</span>, Continue your journey
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#cbd5e1',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Access your account and enjoy all the features we offer for our members.
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
              Learn more
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
              Shop Now
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
              Welcome back
            </h1>
            <p style={{
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              Sign in to your account
            </p>
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
          <div style={{ marginBottom: '24px', position: 'relative' }}>
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
                transition: 'color 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#3b82f6'
                }}
              />
              Beni hatırla
            </label>
            
            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
            >
              Şifremi unuttum?
            </button>
          </div>

          {/* Sign In Button */}
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
            Sign In
          </button>

          {/* Register Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#94a3b8' }}>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={handleRegisterRedirect}
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
                Sign up
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}