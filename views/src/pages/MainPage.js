import React, { useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function MainPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  return (
    <div style={{ backgroundImage: "url('/ylswjsy7stw-scaled.jpg')" }} className="bg-[#fdf6e3] bg-fixed bg-center bg-cover dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 min-h-screen font-sans transition-all duration-700">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
        />
        <div className="absolute inset-0" />

        <div
          className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4"
          data-aos="fade-up"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-wide drop-shadow-xl">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-md sm:text-lg mb-6 opacity-90">
            Explore a wide range of categories, publishers, and genres at unbeatable prices.
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#2c3e50] text-white hover:bg-[#1a242f] font-semibold px-8 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>
      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-[#2c3e50]/90 to-[#1a242f]/80 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mission Statement Side */}
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6 border-b border-yellow-400 pb-3 inline-block">Our Mission</h2>
              <p className="text-lg mb-8 leading-relaxed">
                At Book Haven, our mission is to ignite the love of reading by helping readers discover books they'll cherish and by connecting them with like-minded enthusiasts around the world.
              </p>
              
              <h3 className="text-2xl font-semibold mb-4 text-yellow-300">What You Can Do</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="font-bold text-xl mb-2">Discover New Books</h4>
                  <p>Explore personalized recommendations based on your reading history and preferences.</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="font-bold text-xl mb-2">Connect with Friends</h4>
                  <p>See what your friends are reading and share your thoughts through reviews and ratings.</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="font-bold text-xl mb-2">Organize Your Library</h4>
                  <p>Track what you've read, what you're reading, and what you plan to read next.</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="font-bold text-xl mb-2">Engage with Community</h4>
                  <p>Join discussions, attend virtual events, and bond over books with fellow readers.</p>
                </div>
              </div>
            </div>
            
            {/* Co-founder Quote Side */}
            <div data-aos="fade-left" className="relative">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border-l-4 border-yellow-400 shadow-xl relative">
                <svg className="absolute text-yellow-300 opacity-20 w-32 h-32 -top-6 -left-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <h3 className="text-2xl font-semibold mb-6 relative z-10">A Note from Our Co-Founder</h3>
                <p className="text-lg italic leading-relaxed mb-6 relative z-10">
                  "When I was in second grade, I discovered the Hardy Boys series. Ever since, I've loved to read — both for fun and for growth. I'm always seeking that next captivating story. One day, as I scanned a friend's bookshelf for inspiration, it hit me: when I want book suggestions, I turn to friends — not algorithms. That's why I started Book Haven — a community built around sharing the joy of reading with those you trust."
                </p>
                <div className="flex items-center justify-end relative z-10">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-[#2c3e50] font-bold text-xl mr-3">
                    OC
                  </div>
                  <div>
                    <p className="font-bold">Otis Chandler</p>
                    <p className="text-sm text-yellow-300">Co-Founder</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl z-0"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-blue-400/20 rounded-full blur-xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-black/20 backdrop-blur-[4px]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-12 text-center" data-aos="fade-up">
            Featured Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ name: "Fiction", image: "https://wallpapercave.com/wp/wp5317061.jpg" },
              { name: "Science", image: "https://wallpapercave.com/wp/wp10052052.jpg" },
              { name: "Business", image: "https://wallpaperaccess.com/full/656669.jpg" },
              { name: "Children", image: "https://wallpapers.com/images/hd/toy-story-4-wallpaper-uwa0stmynbka242i.jpg" }].map((cat, idx) => (
              <div
                key={idx}
                data-aos="zoom-in"
                className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center hover:shadow-2xl transition-transform transform hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <h3 className="relative font-semibold text-xl text-gray-700 dark:text-gray-100">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-12 text-center" data-aos="fade-up">
            Popular Picks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {[{ id: 1, title: "The Hidden Hindu Trilogy", author: "Akshat Gupta", price: "$19.99", image: "https://s2.studylib.net/store/data/027204681_1-6633bcbca2b9ed9977538e17da92c316-768x994.png" },
              { id: 2, title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", price: "$24.99", image: "https://th.bing.com/th/id/OIP.m4ws-3VzKs_8lyKBlAhe7gHaLJ?rs=1&pid=ImgDetMain" },
              { id: 3, title: "Dune", author: "Frank Herbert", price: "$15.99", image: "https://th.bing.com/th/id/OIP.HZsq_fP4ByADHb8bJcl92QHaLZ?rs=1&pid=ImgDetMain" },
              { id: 4, title: "The Lion King", author: "Don Ferguson", price: "$22.99", image: "https://vignette.wikia.nocookie.net/world-of-media/images/8/83/The_Lion_King_(Big_Golden_Book).jpg/revision/latest/scale-to-width-down/2000?cb=20191221112250" }].map((book, i) => (
              <div
                key={book.id}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-transform transform hover:scale-105 border-gray-300 dark:border-gray-700"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">By {book.author}</p>
                <p className="text-md font-semibold mt-2">Price: {book.price}</p>
                <Link
                  to="/products"
                  className="mt-4 inline-block text-[#2c3e50] dark:text-yellow-400 hover:underline font-medium"
                >
                  View Book
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background container for testimonials and map section */}
      <div 
        style={{ 
          backgroundImage: "url('/tabletop1.jpg')",
          backgroundSize: "100% auto",  // Fill width, auto height
          backgroundRepeat: "repeat",
          backgroundPosition: "center top"
        }} 
        className="bg-cover"
      >
        {/* Testimonials Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-12 text-white drop-shadow-lg" data-aos="fade-up">What Our Readers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                name: "Aarav Mehta",
                feedback: "This bookstore has an incredible selection! I found rare titles I couldn't find anywhere else.",
                image: "https://randomuser.me/api/portraits/men/75.jpg"
              },
              {
                name: "Naina Kapoor",
                feedback: "Great prices and fast delivery. The website is beautifully designed and easy to use!",
                image: "https://randomuser.me/api/portraits/women/65.jpg"
              },
              {
                name: "Rajeev Thakur",
                feedback: "Customer service is top-notch. Highly recommend for any book lover!",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              }].map((user, idx) => (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow-md text-left hover:shadow-xl transition-transform transform hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h4 className="font-semibold text-lg">{user.name}</h4>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">"{user.feedback}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 text-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-6">Visit Us</h2>
            <p className="mb-8">Our bookstore is nestled in the heart of Chandigarh. Come say hello!</p>
            <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Google Map Location"
                className="w-full h-full"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.642752172497!2d76.77941907543856!3d30.733314074596317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed3db56a243d%3A0x3a2a63306a723697!2sSector%2017%2C%20Chandigarh%2C%20160017!5e0!3m2!1sen!2sin!4v1712744455550!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}