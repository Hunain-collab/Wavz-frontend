'use client';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Plus, Search, Menu, X, User } from 'lucide-react';

export const Navbar: FC = () => {
  const { publicKey } = useWallet();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#08172A' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Image src="/images/logo.png" alt="logo" width={140} height={80} />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Scoped style to force wallet button full width inside mobile menu only */}
      <style>{`
        .mobile-menu-wallet .wallet-adapter-button {
          width: 100% !important;
          height: 48px !important;
          border-radius: 14px !important;
          justify-content: center !important;
          padding: 0 !important;
          font-size: 15px !important;
          font-weight: 600 !important;
        }
        .mobile-menu-wallet .wallet-adapter-dropdown {
          width: 100% !important;
          display: block !important;
        }
        .mobile-menu-wallet .wallet-adapter-button-trigger {
          width: 100% !important;
        }
      `}</style>

      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#08172A' }}>
        <div className="container mx-auto px-4">

          {/* TOP BAR */}
          <div className="flex items-center justify-between h-16">

            {/* LEFT */}
            <div className="flex items-center gap-6">
              <Image src="/images/logo.png" alt="logo" width={140} height={80} />

              {!isMobile && (
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-white">Home</Link>
                  <Link href="/#" className="text-white">GitBook</Link>
                  <Link href="/#" className="text-white">How it Works</Link>
                </div>
              )}
            </div>

            {/* RIGHT DESKTOP */}
            {!isMobile && (
              <div className="flex items-center gap-3">
                <div className="relative w-[360px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-60" />
                  <input
                    type="text"
                    placeholder="Search tokens..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-sm text-white placeholder-[#ffffff9d] outline-none"
                    style={{
                      backgroundColor: '#08172A',
                      border: '1px solid #34557D',
                      borderRadius: '12px',
                    }}
                  />
                </div>

                <Link
                  href="/create"
                  className="flex items-center gap-2 px-6 py-3 text-white"
                  style={{ backgroundColor: '#FE9216', borderRadius: '14px',textAlign:'left',fontSize:'18px',boxShadow:'0 6px 4px 0 rgba(255, 255, 255, 0.50) inset, 0 72px 20px 0 rgba(254, 146, 22, 0.00), 0 46px 18px 0 rgba(254, 146, 22, 0.03), 0 26px 16px 0 rgba(254, 146, 22, 0.11), 0 12px 12px 0 rgba(254, 146, 22, 0.19), 0 3px 6px 0 rgba(254, 146, 22, 0.22)'  }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Token</span>
                </Link>

                   <div className="relative custom-wallet">
    <WalletMultiButton
      className={`${publicKey ? '!px-4' : '!pl-11 !pr-5'} !h-11 !rounded-xl`}
    />

    {!publicKey && (
      <img
        src="/images/wallet.png"
        alt="wallet"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
      />
    )}
  </div>

  {/* PROFILE ICON (ONLY WHEN CONNECTED) */}
  {publicKey && (
    <Link
      href={`/profile/${publicKey.toBase58()}`}
      className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#182536] hover:bg-[#24364d] transition"
    >
      <User className="w-5 h-5 text-white" />
    </Link>
  )}
              </div>
            )}

            {/* MOBILE — hamburger only */}
            {isMobile && (
              <button
                className="text-white p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

          </div>

          {/* MOBILE MENU */}
          {isMobile && menuOpen && (
            <div
              className="flex flex-col gap-5 pb-6 pt-4"
              style={{ borderTop: '1px solid #34557D44' }}
            >
              <Link onClick={() => setMenuOpen(false)} href="/" className="text-white">Home</Link>
              <Link onClick={() => setMenuOpen(false)} href="/#" className="text-white">GitBook</Link>
              <Link onClick={() => setMenuOpen(false)} href="/#" className="text-white">How it Works</Link>

              {/* SEARCH */}
              <div className="relative w-full mb-4 mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-60" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm text-white placeholder-[#ffffff9d] outline-none"
                  style={{
                    backgroundColor: '#0d2138',
                    border: '1px solid #34557D',
                    borderRadius: '12px',
                  }}
                />
              </div>

              {/* CREATE — full width */}
              <Link
                onClick={() => setMenuOpen(false)}
                href="/create"
                className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold mb-2 mt-2"
                style={{backgroundColor: '#FE9216', borderRadius: '14px',textAlign:'left',fontSize:'18px',boxShadow:'0 6px 4px 0 rgba(255, 255, 255, 0.50) inset, 0 72px 20px 0 rgba(254, 146, 22, 0.00), 0 46px 18px 0 rgba(254, 146, 22, 0.03), 0 26px 16px 0 rgba(254, 146, 22, 0.11), 0 12px 12px 0 rgba(254, 146, 22, 0.19), 0 3px 6px 0 rgba(254, 146, 22, 0.22)'  }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Token</span>
              </Link>

              {/* WALLET — full width override via .mobile-menu-wallet */}
<div className="custom-wallet mobile-menu-wallet w-full">
    <WalletMultiButton />
  </div>

  {/* PROFILE */}
  {publicKey && (
    <Link
      href={`/profile/${publicKey.toBase58()}`}
      onClick={() => setMenuOpen(false)}
      className="flex items-center justify-center gap-2 w-full py-3 text-white bg-[#182536] rounded-xl"
    >
      <User className="w-5 h-5" />
      <span>Profile</span>
    </Link>
  )}


            </div>
          )}

        </div>
      </nav>
    </>
  );
};