import Link from 'next/link';

export  function Landingpage() {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">

        <nav className="fixed w-full top-0 z-20 bg-gray-800/70 backdrop-blur-md shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
            <div className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-all">
                ✒️  ShareDraw
            </div>

            <div className="space-x-4">
              <Link href={"/login"}>
                <button className="px-4 py-2 border border-indigo-500 rounded-full hover:bg-indigo-500 transition hover:cursor-pointer">Login</button>
              </Link>
              <Link href={"/signup"}>
                <button className="px-4 py-2 bg-indigo-500 rounded-full hover:bg-indigo-600 transition hover:cursor-pointer">Signup</button>
              </Link>
            </div>
          </div>
        </nav>
  
        <div className="h-20"></div>
  
        <section className="text-center py-16 px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeInUp">Welcome to ShareDraw</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-6 animate-fadeInUp delay-150">
            Experience the beautiful magic on your canvas.
          </p>
          <Link href={"/signup"}>
            <button className=" hover:cursor-pointer px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
              Get Started 🚀
            </button>
          </Link>
        </section>

        <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16">

          {[
            { title: "Minimalistic UI 🐈‍⬛", text: "Enjoy a clean, distraction-free workspace with modern design." },
            { title: "Real-time Rooms 🌐", text: "Create and join rooms as you like." },
            { title: "Fully Responsive 🤳", text: "Looks great on mobile, tablet, and desktop." },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
              <p className="text-gray-300">{feature.text}</p>
            </div>
          ))}
        </section>
  
        <section className="text-center py-16 bg-gray-800/50 backdrop-blur-lg">
          <h2 className="text-3xl font-bold mb-4">Join ShareDraw Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">Enhance your creativity and ideas on the canvas.</p>
          <Link href={"/signup"}>
            <button className="px-8 py-3 bg-indigo-500 rounded-full hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-lg hover:cursor-pointer">
              Sign Up Now
          </button>
          </Link>
        </section>
  
        <footer className="bg-gray-800/70 backdrop-blur-md text-gray-500 text-center p-4">
          🤖 {new Date().getFullYear()} ShareDraw | Designed with ❤️ using Tailwind CSS | Typescript | Node.js
        </footer>
      </div>
        );
  }
  