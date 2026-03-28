import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

interface PageBannerProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    gradient?: string;
    showBack?: boolean;
}

const PageBanner: React.FC<PageBannerProps> = ({ 
    title, 
    subtitle, 
    icon: Icon, 
    gradient = 'var(--grad-primary)', 
    showBack = false 
}) => {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ 
            marginBottom: '2.5rem', 
            padding: '2.5rem', 
            background: gradient, 
            border: 'none', 
            position: 'relative', 
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            borderRadius: '24px'
        }}>
            {/* Background Graphic */}
            <div style={{ 
                position: 'absolute', 
                right: '-20px', 
                bottom: '-30px', 
                opacity: 0.1, 
                transform: 'rotate(-10deg)' 
            }}>
                <Icon size={240} />
            </div>

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {showBack && (
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn-icon" 
                        style={{ 
                            width: '56px', 
                            height: '56px', 
                            backgroundColor: 'rgba(255,255,255,0.15)', 
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            color: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <ArrowLeft size={28} />
                    </button>
                )}
                
                <div style={{ 
                    padding: '1.25rem', 
                    backgroundColor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Icon size={40} />
                </div>

                <div>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 900, 
                        color: 'white', 
                        letterSpacing: '-0.04em', 
                        marginBottom: '0.25rem',
                        textShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{ 
                            color: 'rgba(255,255,255,0.85)', 
                            fontSize: '1.1rem', 
                            fontWeight: 500,
                            maxWidth: '600px'
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageBanner;
