'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  links?: { label: string; href: string }[];
}

const BOOKLY_SITE_INFO = `
You are BookBuddy, the friendly and knowledgeable AI assistant for BOOKLY — a premium curated Indian online bookstore.

== WEBSITE PAGES & NAVIGATION ==
- Home (/) — Browse featured books, categories, Indian language section, and bundle deals
- Catalog (/books) — All 28+ books with filters by category, price, rating, stock
- Book Match (/book-match) — AI quiz: 5 questions → personalized book recommendations
- Compare (/compare) — Side-by-side comparison of up to 3 books
- Wishlist (/wishlist) — Your saved books (click ♡ heart on any card)
- Cart (/cart) — Your shopping cart
- Orders (/orders) — Track your past orders
- About (/about) — About BOOKLY's mission
- Contact (/contact) — Reach the BOOKLY team
- FAQ (/faq) — Frequently asked questions
- Register (/register) — Create a new account
- Login (/login) — Log in to your account

== BOOK CATEGORIES ==
1. Computer Science — Clean Code, Designing Data-Intensive Applications, The Pragmatic Programmer, Refactoring
2. Fiction — The Alchemist, 1984
3. Self-Help — Atomic Habits, Thinking Fast and Slow, Deep Work
4. Business & Finance — The Psychology of Money, Zero to One, The Lean Startup
5. Science & Nature — Cosmos, Sapiens
6. Design & UI/UX — Don't Make Me Think, The Design of Everyday Things
7. हिंदी पुस्तकें (Hindi) — गोदान, रामचरितमानस, मृत्युंजय, सत्य के प्रयोग, चाणक्य नीति, पंचतंत्र
8. ગુજરાતી પુસ્તકો (Gujarati) — સરસ્વતીચંદ્ર, ઝેર તો પીધાં છે, ગ્રામ્ય ગુજરાત, ધ્વની

== FEATURES ==
- Book Match AI: 5-question quiz → personalized book shortlist. Navigation → "Book Match"
- Compare: Add up to 3 books via ⇄ icon on any book card → visit Compare page
- Wishlist: Click ♡ heart icon on any book card to save
- Custom cursor: Special animated cursor on desktop
- Language filter: Filter books by Hindi/Gujarati in catalog

== PRICING & DISCOUNTS ==
- Books range: ₹149 (Ramcharitmanas) to ₹1250 (Designing Data-Intensive Applications)
- Hindi books: ₹149–₹299 | Gujarati books: ₹189–₹349
- CS books average: ₹600–₹1200
- Extra 5% off on prepaid orders (UPI, Card, Net Banking)
- Free shipping on orders above ₹500

== PAYMENT OPTIONS ==
- UPI (GPay, PhonePe, BHIM, Paytm)
- Credit/Debit Card (Visa, Mastercard, RuPay)
- Net Banking
- Cash on Delivery (COD) — extra 5% for prepaid

== SHIPPING & DELIVERY ==
- Dispatch within 24 hours of order
- Standard delivery: 3–7 business days
- Free shipping on orders ≥ ₹500; otherwise ₹49
- Ships across India and internationally

== RETURNS & REFUNDS ==
- 7-day return window for damaged/wrong items
- Refund processed in 3–5 business days to original payment method
- Contact via /contact page or bookbuddy chat

== ACCOUNT & AUTH ==
- Register at /register with email + password
- Login at /login
- Passwords secured with bcrypt hashing
- JWT tokens for session management
- View orders at /orders after login

== BOOKLY BUNDLES ==
- The System Architect Trio: Clean Code + DDIA + Pragmatic Programmer = ₹2299 (save 19%)
- Mindset & Capital: Atomic Habits + Psychology of Money + Thinking Fast & Slow = ₹1149 (save 21%)
- Cosmic Perspective: Sapiens + Cosmos + 1984 = ₹1049 (save 22%)

== PERSONALITY ==
You are warm, knowledgeable, and genuinely helpful. You love books. You give SPECIFIC, ACTIONABLE answers — not vague ones. When someone has a problem, you solve it step by step. Always mention relevant page links when appropriate. Support Hindi and Gujarati queries too.
`;

const QUICK_QUESTIONS = [
  '📚 Recommend a book for me',
  '🇮🇳 Hindi / Gujarati books?',
  '💰 Payment options?',
  '🚚 Shipping & delivery?',
  '⇄ How does Compare work?',
  '⭐ Best CS books?',
];

function generateResponse(userMessage: string): { text: string; links?: { label: string; href: string }[] } {
  const msg = userMessage.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|namaste|kem cho|namaskar|sat sri akal)\b/.test(msg)) {
    return {
      text: "Namaste! 👋 I'm **BookBuddy**, your BOOKLY reading assistant! I can help you:\n• 📚 Find the perfect book\n• 🇮🇳 Discover Hindi & Gujarati books\n• 💳 Understand payments & shipping\n• ⇄ Use Compare, Wishlist, Book Match features\n\nWhat are you looking for today?",
      links: [{ label: 'Browse Catalog', href: '/books' }, { label: 'Try Book Match', href: '/book-match' }],
    };
  }

  // Hindi books
  if (msg.includes('hindi') || msg.includes('हिंदी') || msg.includes('premchand') || msg.includes('godan') || msg.includes('chanakya') || msg.includes('panchtantra')) {
    return {
      text: "हम हिंदी पुस्तकें उपलब्ध कराते हैं! 🇮🇳 हमारे पास अभी ये हिंदी पुस्तकें हैं:\n\n• **गोदान** — मुंशी प्रेमचंद (₹179)\n• **रामचरितमानस** — तुलसीदास (₹141)\n• **मृत्युंजय** — शिवाजी सावंत (₹254)\n• **सत्य के प्रयोग** — महात्मा गाँधी (₹224)\n• **चाणक्य नीति** (₹143)\n• **पंचतंत्र** — विष्णु शर्मा (₹135)\n\nCatalog पर जाकर **हिंदी पुस्तकें** category चुनें।",
      links: [{ label: 'Hindi Books Catalog', href: '/books?category=hindi-books' }],
    };
  }

  // Gujarati books
  if (msg.includes('gujarati') || msg.includes('ગુજરાતી') || msg.includes('saraswatichandra') || msg.includes('meghani')) {
    return {
      text: "BOOKLY પર ગુજરાતી પુસ્તકો ઉપલબ્ધ છે! 🇮🇳\n\n• **સરસ્વતીચંદ્ર** — ગોવર્ધનરામ ત્રિપાઠી (₹314)\n• **ઝેર તો પીધાં છે** — ચુનીલાલ મડિયા (₹212)\n• **ગ્રામ્ય ગુજરાત** — ઝ. મેઘાણી (₹179)\n• **ધ્વની** — ઉમાશંકર જોષી (₹202)\n\nCatalog page પર **ગુજરાતી પુસ્તકો** filter select કરો.",
      links: [{ label: 'Gujarati Books', href: '/books?category=gujarati-books' }],
    };
  }

  // Indian language / regional
  if (msg.includes('indian') || msg.includes('regional') || msg.includes('bharat') || msg.includes('language') || msg.includes('marathi') || msg.includes('bengali')) {
    return {
      text: "Yes! BOOKLY is proud to carry **Indian language books**! 🇮🇳\n\nCurrently available:\n• **हिंदी** — 6 books (Premchand, Gandhi, Tulsidas...)\n• **ગુજરાતી** — 6 books (Saraswatichandra, Meghani...)\n\n**Coming soon:** Marathi, Bengali, Tamil, Telugu\n\nCheck the Indian Languages section on the homepage or use category filters in the catalog.",
      links: [{ label: 'View Catalog', href: '/books' }, { label: 'Back to Home', href: '/' }],
    };
  }

  // Recommendations
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('what should i read') || msg.includes('best book')) {
    return {
      text: "Great! Let me help you find the perfect read. Quick recommendations:\n\n🏆 **All-time bestsellers:**\n• **Atomic Habits** (₹374) — #1 self-help, 15M+ readers\n• **1984** by Orwell (₹249) — timeless dystopian classic\n\n💻 **For techies:** Clean Code (₹594) or Designing Data-Intensive Applications (₹1125)\n\n🧠 **For mindset:** Deep Work (₹377) or Thinking Fast & Slow (₹450)\n\nOr try our **Book Match AI** — answer 5 questions and get a personalized list!",
      links: [{ label: 'Try Book Match', href: '/book-match' }, { label: 'Browse All Books', href: '/books' }],
    };
  }

  // Compare feature
  if (msg.includes('compare') || msg.includes('comparison')) {
    return {
      text: "The **Compare** feature lets you analyze up to 3 books side-by-side! Here's how:\n\n1️⃣ Go to any book card — click the **⇄ icon** (top-right of the cover)\n2️⃣ A compare tray appears at the bottom of the screen\n3️⃣ Add 1–3 books, then click **\"Compare Now\"**\n4️⃣ See a full matrix: price, rating, category, ISBN, publisher, stock\n5️⃣ Add to cart directly from the compare page!",
      links: [{ label: 'Go to Compare', href: '/compare' }, { label: 'Browse Books', href: '/books' }],
    };
  }

  // Book Match
  if (msg.includes('book match') || msg.includes('bookmatch') || msg.includes('quiz') || msg.includes('recommendation quiz')) {
    return {
      text: "**Book Match** is our AI recommendation quiz! 🎯\n\nHow it works:\n1. Visit the Book Match page\n2. Answer 5 quick questions about your reading mood, goals, and time availability\n3. Our engine scores the entire catalog for you\n4. Get an instant **top-3 personalized recommendations** with reasons\n\nTakes only 60 seconds! Perfect when you're not sure what to read next.",
      links: [{ label: '⚡ Try Book Match', href: '/book-match' }],
    };
  }

  // Payment
  if (msg.includes('payment') || msg.includes('pay') || msg.includes('upi') || msg.includes('card') || msg.includes('cod') || msg.includes('cash')) {
    return {
      text: "BOOKLY accepts multiple payment methods:\n\n💳 **Prepaid (get 5% extra off!):**\n• UPI — GPay, PhonePe, BHIM, Paytm\n• Credit/Debit Card (Visa, Mastercard, RuPay)\n• Net Banking\n\n🏠 **Cash on Delivery (COD)** — available nationwide\n\n🔒 All payments processed securely. Prepaid = extra 5% discount automatically applied at checkout.",
      links: [{ label: 'Go to Cart', href: '/cart' }],
    };
  }

  // Shipping
  if (msg.includes('shipping') || msg.includes('delivery') || msg.includes('dispatch') || msg.includes('courier')) {
    return {
      text: "📦 **BOOKLY Shipping Info:**\n\n• **Dispatch:** Within 24 hours of order confirmation\n• **Delivery time:** 3–7 business days across India\n• **Free shipping:** On orders ₹500 and above\n• **Shipping charge:** Only ₹49 for orders below ₹500\n• **International:** Yes, we ship worldwide!\n\n💡 Pro tip: Add Atomic Habits (₹374) + The Alchemist (₹269) to unlock free shipping!",
      links: [{ label: 'Browse Books', href: '/books' }],
    };
  }

  // Returns/refund
  if (msg.includes('return') || msg.includes('refund') || msg.includes('cancel') || msg.includes('exchange') || msg.includes('wrong book') || msg.includes('damaged')) {
    return {
      text: "😊 **Returns & Refunds are easy at BOOKLY:**\n\n• **Return window:** 7 days from delivery\n• **Eligible if:** Book is damaged, wrong item sent, or misprinted\n• **Refund timeline:** 3–5 business days to your original payment method\n\n**To initiate a return:**\n1. Go to /orders to find your order\n2. Click \"Return Request\" on the order\n3. Or contact us via the Contact page\n\nWe'll sort it out quickly!",
      links: [{ label: 'My Orders', href: '/orders' }, { label: 'Contact Us', href: '/contact' }],
    };
  }

  // Account / Login / Register
  if (msg.includes('account') || msg.includes('login') || msg.includes('register') || msg.includes('sign up') || msg.includes('sign in') || msg.includes('forgot password')) {
    return {
      text: "🔐 **Account Help:**\n\n**New to BOOKLY?** → Register at /register (takes 30 seconds)\n**Already have an account?** → Login at /login\n\n**Forgot password?** Use the \"Forgot Password\" link on the login page — we'll email you a reset link.\n\nAfter logging in, you can:\n• View order history at /orders\n• Manage your wishlist\n• Track deliveries",
      links: [{ label: 'Login', href: '/login' }, { label: 'Register', href: '/register' }, { label: 'My Orders', href: '/orders' }],
    };
  }

  // Wishlist
  if (msg.includes('wishlist') || msg.includes('save') || msg.includes('favourite') || msg.includes('favorite') || msg.includes('heart')) {
    return {
      text: "❤️ **Wishlist — Save Books for Later:**\n\nTo save a book:\n1. Find any book in the catalog\n2. Click the **♡ heart icon** on the top-right of the book cover\n3. It turns pink/red — book is saved!\n\nTo view your wishlist: Click the ♡ icon in the **navigation bar** at the top.\n\nYour wishlist persists across browser sessions. Move items to cart anytime!",
      links: [{ label: 'View Wishlist', href: '/wishlist' }],
    };
  }

  // Discount / offers
  if (msg.includes('discount') || msg.includes('offer') || msg.includes('coupon') || msg.includes('promo') || msg.includes('deal') || msg.includes('save')) {
    return {
      text: "💰 **Current BOOKLY Deals:**\n\n• **Atomic Habits** — 25% OFF (₹374 instead of ₹499)\n• **The Pragmatic Programmer** — 20% OFF\n• **Zero to One** — 20% OFF\n• **Sapiens** — 20% OFF\n• **Hindi books** — 5–20% OFF across the range\n\n**Bundles (best value):**\n• System Architect Trio — save ₹549 (19% off)\n• Mindset & Capital Trio — save ₹298 (21% off)\n\n➕ Extra **5% off** on all prepaid orders!",
      links: [{ label: 'Browse Deals', href: '/books' }, { label: 'View Bundles', href: '/#bundles' }],
    };
  }

  // Price / budget
  if (msg.includes('price') || msg.includes('cost') || msg.includes('cheap') || msg.includes('expensive') || msg.includes('budget') || msg.includes('affordable')) {
    return {
      text: "📊 **BOOKLY Price Range:**\n\n• **₹149** — Ramcharitmanas (cheapest!)\n• **₹199–₹299** — Hindi & Gujarati books\n• **₹249–₹499** — Fiction, Self-Help\n• **₹449–₹749** — Business, Design books\n• **₹899–₹1250** — CS/Engineering books\n\n💡 Use **price filter** in the catalog to set your budget range.\n🎁 **Free shipping** on orders ≥ ₹500!",
      links: [{ label: 'Browse by Price', href: '/books' }],
    };
  }

  // CS / programming / tech
  if (msg.includes('computer') || msg.includes('programming') || msg.includes('software') || msg.includes('code') || msg.includes('developer') || msg.includes('engineering') || msg.includes('tech')) {
    return {
      text: "💻 **Top Computer Science Books at BOOKLY:**\n\n🥇 **Clean Code** by Robert C. Martin — ₹594 (15% off)\n→ Essential for writing maintainable code\n\n🥇 **Designing Data-Intensive Applications** — ₹1125\n→ The bible for system design & distributed systems\n\n🥈 **The Pragmatic Programmer** — ₹719 (20% off)\n→ Career-defining read for software engineers\n\n🥈 **Refactoring** by Martin Fowler — ₹1055\n→ Master improving existing code\n\nAll are genuine publisher editions!",
      links: [{ label: 'CS Books Catalog', href: '/books?category=computer-science' }],
    };
  }

  // Fiction
  if (msg.includes('fiction') || msg.includes('novel') || msg.includes('story') || msg.includes('literature')) {
    return {
      text: "📖 **Fiction at BOOKLY:**\n\n• **The Alchemist** by Paulo Coelho — ₹269 (10% off)\n→ A timeless philosophical fable. Perfect first read!\n\n• **1984** by George Orwell — ₹249\n→ Haunting dystopian masterpiece. Still shockingly relevant.\n\n**Indian Literature:**\n• गोदान — Premchand's greatest Hindi novel (₹179)\n• Saraswatichandra — Gujarati classic (₹314)\n\nBrowse all fiction with category filter!",
      links: [{ label: 'Fiction Books', href: '/books?category=fiction' }],
    };
  }

  // Self-help
  if (msg.includes('self help') || msg.includes('self-help') || msg.includes('habit') || msg.includes('productivity') || msg.includes('focus') || msg.includes('motivation')) {
    return {
      text: "🧠 **Self-Help Books at BOOKLY:**\n\n🏆 **Atomic Habits** — ₹374 (25% off!) ← Our #1 bestseller\n→ Build good habits, break bad ones. 15M+ readers worldwide.\n\n⚡ **Deep Work** — ₹377 (12% off)\n→ Master focused work in a distracted world.\n\n🧩 **Thinking, Fast and Slow** — ₹450 (18% off)\n→ Nobel Prize-winning psychology of decision making.\n\nAll three together = the ultimate productivity trilogy!",
      links: [{ label: 'Self-Help Books', href: '/books?category=self-help' }, { label: 'View Bundles', href: '/' }],
    };
  }

  // Business
  if (msg.includes('business') || msg.includes('startup') || msg.includes('entrepreneur') || msg.includes('finance') || msg.includes('money') || msg.includes('invest')) {
    return {
      text: "💼 **Business & Finance Books:**\n\n📈 **The Psychology of Money** — ₹339 (15% off)\n→ Why smart people make irrational financial decisions.\n\n🚀 **Zero to One** by Peter Thiel — ₹360 (20% off)\n→ The startup founder's essential guide.\n\n⚡ **The Lean Startup** by Eric Ries — ₹409 (18% off)\n→ Build, measure, learn — the startup playbook.\n\nPerfect for founders, investors, and anyone building something new!",
      links: [{ label: 'Business Books', href: '/books?category=business-finance' }],
    };
  }

  // Orders / tracking
  if (msg.includes('order') || msg.includes('track') || msg.includes('status') || msg.includes('where is my')) {
    return {
      text: "📦 **Order Tracking at BOOKLY:**\n\nTo track your order:\n1. Make sure you're **logged in**\n2. Go to the **Orders page** (/orders)\n3. You'll see all your orders with status: Pending → Processing → Dispatched → Delivered\n\nTypically:\n• Order confirmed → dispatched within **24 hours**\n• Delivery: **3–7 business days**\n\nIf your order is taking longer, please contact us via the Contact page!",
      links: [{ label: 'My Orders', href: '/orders' }, { label: 'Contact Us', href: '/contact' }],
    };
  }

  // Thank you
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('great') || msg.includes('helpful') || msg.includes('awesome')) {
    return {
      text: "You're so welcome! 😊📚 That's what I'm here for.\n\nHappy reading! If you need anything else — book recommendations, order help, or anything BOOKLY — just ask. I'm available 24/7!\n\n**Namaste & Happy Reading! 🙏**",
    };
  }

  // FAQ / help
  if (msg.includes('faq') || msg.includes('help') || msg.includes('how to') || msg.includes('how do i')) {
    return {
      text: "Here are the most helpful pages:\n\n📖 **FAQ** — Common questions answered\n📞 **Contact** — Reach our team directly\n🔐 **Login / Register** — Account help\n📦 **Orders** — Track your deliveries\n\nOr just ask me anything specific — I know BOOKLY inside out!",
      links: [{ label: 'FAQ', href: '/faq' }, { label: 'Contact Us', href: '/contact' }, { label: 'Login', href: '/login' }],
    };
  }

  // Generic fallback — still helpful
  return {
    text: "I want to help you properly! Could you be a bit more specific? I can assist with:\n\n📚 **Book recommendations** — by genre, mood, or budget\n🇮🇳 **Hindi / Gujarati books**\n⇄ **How to compare books**\n💰 **Pricing, discounts, bundles**\n🚚 **Shipping & delivery info**\n🔐 **Account, login, orders**\n\nJust ask and I'll solve it for you!",
    links: [{ label: 'Browse Books', href: '/books' }, { label: 'Contact Us', href: '/contact' }],
  };
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Namaste! 👋 I'm **BookBuddy** — your BOOKLY reading companion. I can help with book recommendations, Hindi/Gujarati books, payments, orders, and any question about this website. How can I help you?",
      timestamp: new Date(),
      links: [{ label: 'Browse Books', href: '/books' }, { label: 'Book Match', href: '/book-match' }],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        links: response.links,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      return part.split('\n').map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className='fixed bottom-6 right-6 z-50'>
        {!isOpen && (
          <span className='absolute inset-0 rounded-full bg-[var(--bg-accent-violet)] opacity-40 animate-ping' />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Open AI Assistant'
          className={
            'relative w-14 h-14 rounded-full border-2 border-[var(--border-main)] flex items-center justify-center text-xl font-bold shadow-[4px_4px_0px_var(--border-main)] transition-all duration-200 ' +
            (isOpen
              ? 'bg-[var(--text-main)] text-[var(--bg-page)] rotate-0'
              : 'bg-[var(--bg-accent-violet)] text-white hover:scale-105')
          }
        >
          {isOpen ? '×' : '💬'}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className='fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] flex flex-col border-2 border-[var(--border-main)] bg-[var(--bg-surface)] shadow-[8px_8px_0px_var(--border-main)] animate-scale-in'>
          {/* Header */}
          <div className='flex items-center gap-3 px-4 py-3 border-b-2 border-[var(--border-main)]' style={{ background: 'linear-gradient(135deg, var(--bg-accent-violet) 0%, var(--bg-accent-blue) 100%)' }}>
            <div className='w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-lg font-black text-white'>
              📚
            </div>
            <div>
              <p className='font-editorial-mono text-xs font-bold uppercase tracking-wider text-white'>BookBuddy</p>
              <div className='flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
                <span className='font-editorial-mono text-[9px] uppercase tracking-wider text-white/70'>BOOKLY AI · Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='ml-auto text-white/70 hover:text-white transition-opacity text-xl font-bold'
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3 min-h-0' style={{ maxHeight: '340px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={'flex flex-col ' + (msg.role === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={
                    'max-w-[90%] px-3 py-2.5 text-sm leading-relaxed font-editorial-sans ' +
                    (msg.role === 'user'
                      ? 'bg-[var(--bg-accent-violet)] text-white border-2 border-[var(--border-main)] rounded-tl-lg rounded-bl-lg rounded-tr-none'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-main)] border-2 border-[var(--border-subtle)] rounded-tr-lg rounded-br-lg rounded-tl-none')
                  }
                >
                  {renderContent(msg.content)}
                </div>
                {/* Quick links */}
                {msg.links && msg.links.length > 0 && msg.role === 'assistant' && (
                  <div className='flex flex-wrap gap-1.5 mt-1.5 max-w-[90%]'>
                    {msg.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className='px-2.5 py-1 text-[10px] font-editorial-mono font-bold uppercase tracking-wider border border-[var(--bg-accent-violet)] text-[var(--bg-accent-violet)] hover:bg-[var(--bg-accent-violet)] hover:text-white transition-colors rounded-sm'
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className='flex justify-start'>
                <div className='px-4 py-3 bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-subtle)] flex gap-1 rounded-tr-lg rounded-br-lg'>
                  <span className='w-2 h-2 bg-[var(--bg-accent-violet)] rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                  <span className='w-2 h-2 bg-[var(--bg-accent-violet)] rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                  <span className='w-2 h-2 bg-[var(--bg-accent-violet)] rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className='px-4 pb-2 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-2'>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className='px-2.5 py-1.5 text-[10px] font-editorial-mono font-bold uppercase tracking-wider border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-accent-violet)] hover:text-white hover:border-[var(--bg-accent-violet)] transition-colors'
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className='border-t-2 border-[var(--border-main)] flex'
          >
            <input
              ref={inputRef}
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Ask BookBuddy anything...'
              className='flex-1 px-4 py-3 font-editorial-mono text-sm bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none border-r-2 border-[var(--border-main)]'
            />
            <button
              type='submit'
              disabled={!inputValue.trim()}
              className='px-4 py-3 font-editorial-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
              style={{ background: 'var(--bg-accent-violet)', color: 'white' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
