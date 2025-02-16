import React from 'react'
import { FaStar } from 'react-icons/fa'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import image from "../assets/image01.jpg"
function Features() {
  const testimonials = [
    { name: 'John Doe', feedback: 'The courses were extremely informative and practical!', rating: 5, image: image },
    { name: 'Jane Smith', feedback: 'I loved the hands-on approach in the web development course.', rating: 4, image: image },
    { name: 'Mike Johnson', feedback: 'App development lessons were clear and well-organized.', rating: 5, image: image },
    { name: 'Emily Davis', feedback: 'Graphics course helped me launch my freelance career.', rating: 4,image: image }
  ]

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <section id="features" className="py-20 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mt-16">
          <h2 className="text-3xl font-semibold mb-6">What Our Customers Say</h2>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-blue-100 rounded-xl shadow-lg">
                <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 mx-auto mb-4 rounded-full object-cover" />
                <p className="text-xl mb-4">"{testimonial.feedback}"</p>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Features
