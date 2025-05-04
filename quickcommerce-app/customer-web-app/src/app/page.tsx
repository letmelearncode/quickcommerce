import Link from 'next/link';
import Image from 'next/image';

// Sample data for categories and featured products
const categories = [
  {
    id: 1,
    name: 'Groceries',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=320&h=320',
    href: '/categories/groceries',
  },
  {
    id: 2,
    name: 'Fresh Produce',
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?auto=format&fit=crop&q=80&w=320&h=320',
    href: '/categories/fresh-produce',
  },
  {
    id: 3,
    name: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=320&h=320',
    href: '/categories/dairy-eggs',
  },
  {
    id: 4,
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1527156438759-768ecc328336?auto=format&fit=crop&q=80&w=320&h=320',
    href: '/categories/beverages',
  },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Organic Bananas',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=240&h=240',
    href: '/products/1',
  },
  {
    id: 2,
    name: 'Fresh Milk',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=240&h=240',
    href: '/products/2',
  },
  {
    id: 3,
    name: 'Avocado',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&q=80&w=240&h=240',
    href: '/products/3',
  },
  {
    id: 4,
    name: 'Whole Grain Bread',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=240&h=240',
    href: '/products/4',
  },
  {
    id: 5,
    name: 'Free Range Eggs',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=240&h=240',
    href: '/products/5',
  },
  {
    id: 6,
    name: 'Bottled Water',
    price: 0.99,
    image: 'https://images.unsplash.com/photo-1616118132534-731f9bfc5be8?auto=format&fit=crop&q=80&w=240&h=240',
    href: '/products/6',
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section - Vibrant Background with Brand Colors */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6321CE] to-[#FF4590]" />
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="circles" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="20" fill="url(#circles)" />
            <circle cx="80" cy="30" r="15" fill="url(#circles)" />
            <circle cx="40" cy="70" r="25" fill="url(#circles)" />
            <circle cx="80" cy="80" r="10" fill="url(#circles)" />
          </svg>
        </div>
        <div className="relative mx-[5%] max-w-[1440px] mx-auto py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <div className="mb-4 transform hover:scale-110 transition-transform duration-500">
            <svg className="h-20 w-20 text-white mb-2 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-reveal">
            Fresh Groceries, <span className="text-[#FFDF00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Delivered Fast</span>
          </h1>
          <p className="text-xl md:text-3xl text-white max-w-3xl mb-8 opacity-90">
            Get your groceries delivered in as little as <span className="font-bold bg-[#FF4590] px-2 rounded-md">15 minutes</span>. Fresh from the store to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-[#6321CE] bg-white hover:bg-[#FFDF00] transition-colors duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
            <Link 
              href="/how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white hover:bg-white/20 transition-colors duration-300 transform hover:scale-105"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Light Background with Vibrant Elements */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F3F0FF] relative">
        <div className="mx-[5%] max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-[#FF4590]/10 rounded-full px-6 py-2 mb-4">
              <span className="text-[#FF4590] font-semibold">EXPLORE</span>
            </div>
            <h2 className="text-4xl font-bold text-[#172B4D]">
              Shop by Category
            </h2>
            <p className="mt-4 text-xl text-[#6B778C] max-w-2xl mx-auto">
              Find what you need quickly from our most popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={category.href}
                className="group"
              >
                <div className="relative h-60 overflow-hidden rounded-2xl shadow-lg transition transform group-hover:scale-105 group-hover:shadow-xl border-2 border-transparent hover:border-[#6321CE]">
          <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6321CE]/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white group-hover:translate-y-0 transform transition-transform duration-300">{category.name}</h3>
                    <p className="text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Now →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Vibrant Background with White Cards */}
      <section className="pt-20 pb-16 bg-gradient-to-r from-[#6321CE] to-[#FF4590] relative mt-0">
        <div className="relative mx-[5%] max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-white font-semibold">TRENDING NOW</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Featured Products
            </h2>
            <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
              Our most popular items, ready for quick delivery
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={product.href}
                className="group transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden p-3 h-full flex flex-col">
                  <div className="relative rounded-xl overflow-hidden aspect-square mb-2">
                    <div className="absolute top-2 right-2 z-10 bg-[#FF4590] text-white text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </div>
          <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-[#172B4D] group-hover:text-[#6321CE]">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-bold text-[#FF4590]">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="h-8 w-8 bg-[#6321CE]/10 rounded-full flex items-center justify-center group-hover:bg-[#6321CE] transition-colors duration-300">
                        <svg className="h-4 w-4 text-[#6321CE] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-full shadow-lg text-base font-bold text-[#6321CE] bg-white hover:bg-[#FFDF00] transition-all duration-300 transform hover:scale-105"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Fast, Easy Ordering Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#6321CE]/5 pattern-diagonal-lines"></div>
        <div className="relative mx-[5%] max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-[#6321CE]/10 rounded-full px-6 py-2 mb-4">
              <span className="text-[#6321CE] font-semibold">EASY PROCESS</span>
            </div>
            <h2 className="text-4xl font-bold text-[#172B4D]">
              Fast, Easy Ordering
            </h2>
            <p className="mt-4 text-xl text-[#6B778C] max-w-2xl mx-auto">
              Order your groceries with just a few clicks and get them delivered in as little as 15 minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gradient-to-br from-white to-[#F3F0FF] rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-[#6321CE] w-14 h-14 rounded-bl-2xl flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="pt-10 px-8 pb-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#6321CE] text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#172B4D] mb-3 text-center">Add to Cart</h3>
                  <p className="text-[#6B778C] text-center">Select your favorite products and add them to your cart with a single click.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-[#F3F0FF] rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-[#FF4590] w-14 h-14 rounded-bl-2xl flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="pt-10 px-8 pb-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#FF4590] text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#172B4D] mb-3 text-center">Checkout</h3>
                  <p className="text-[#6B778C] text-center">Proceed to checkout and complete your payment quickly and securely.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-[#F3F0FF] rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-[#FFDF00] w-14 h-14 rounded-bl-2xl flex items-center justify-center text-[#172B4D] font-bold text-xl">
                  3
                </div>
                <div className="pt-10 px-8 pb-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#FFDF00] text-[#172B4D] mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#172B4D] mb-3 text-center">Delivery</h3>
                  <p className="text-[#6B778C] text-center">Sit back and relax. Your order will be at your doorstep in no time!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Delivery Section - Vibrant Background with Light Cards */}
      <section className="py-20 bg-gradient-to-r from-[#6321CE] to-[#FF4590] relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="h-full w-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,5 C75,20 50,30 0,5 L0,0 Z" fill="white" />
            <path d="M0,100 L100,100 L100,95 C50,80 25,90 0,95 L0,100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative mx-[5%] max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-white font-semibold">LIGHTNING FAST</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Delivery in as little as <span className="text-[#FFDF00]">15 minutes</span>
            </h2>
            <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
              Order now and experience the quickest delivery in town
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transition-transform duration-300 hover:transform hover:scale-105 group">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white text-center">Easy Ordering</h3>
                <p className="text-white/80 text-center text-lg">Browse our selection and add items to your cart with just a few taps.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transition-transform duration-300 hover:transform hover:scale-105 group">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white text-center">Lightning Fast</h3>
                <p className="text-white/80 text-center text-lg">Our delivery partners are ready to bring your order in record time.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transition-transform duration-300 hover:transform hover:scale-105 group">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white text-center">Real-time Tracking</h3>
                <p className="text-white/80 text-center text-lg">Know exactly where your order is with our live tracking feature.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Review Section - Light Background with Enhanced Cards */}
      <section className="py-20 bg-white">
        <div className="mx-[5%] max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-[#FFDF00]/20 rounded-full px-6 py-2 mb-4">
              <span className="text-[#6321CE] font-semibold">TESTIMONIALS</span>
            </div>
            <h2 className="text-4xl font-bold text-[#172B4D]">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-xl text-[#6B778C] max-w-2xl mx-auto">
              Thousands of happy customers trust our quick delivery service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-white to-[#F3F0FF] rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="text-[#FFDF00] flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-6 w-6 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-[#6B778C] mb-6 text-lg">
                  {i === 1 && "Incredibly fast delivery! I ordered groceries and they arrived in just 20 minutes. Everything was fresh and exactly what I ordered."}
                  {i === 2 && "The app is so easy to use and the delivery was surprisingly quick. I'll definitely be using this service again."}
                  {i === 3 && "I love being able to track my order in real-time. The delivery person was friendly and professional. 5 stars!"}
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6321CE] to-[#FF4590] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {i === 1 && "JD"}
                      {i === 2 && "SM"}
                      {i === 3 && "AK"}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-bold text-[#172B4D]">
                      {i === 1 && "John Doe"}
                      {i === 2 && "Sarah Miller"}
                      {i === 3 && "Aisha Khan"}
                    </p>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-[#6321CE] mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-[#6B778C]">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
    </div>
      </section>
    </main>
  );
}
