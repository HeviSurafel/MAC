import React, { useState } from "react";
import FaqItem from "./FaqItem";

const faqs = [
    {
      question: "How does Makalla Code Academy work?",
      answer:
        "Makalla Code Academy offers various coding courses that are designed to teach you essential programming skills. The courses are taught by experienced instructors and cover topics ranging from web development to software engineering.",
    },
   
    {
        question: "How can I enroll in a course at Makalla Code Academy?",
        answer:
          "To enroll in a course, visit our office located in Arbaminch, Secha Ajip. Once you arrive, contact our admin for assistance. They will guide you through the course options and help you with the enrollment process. After enrollment, you can proceed with your course and start learning immediately.",
      }
    ,      
   
    {
      question: "Do you offer certifications upon course completion?",
      answer:
        "Yes! Upon completing a course at Makalla Code Academy, you will receive a certification that validates your skills and achievements. This certificate can be added to your resume or shared with potential employers.",
    },
    {
        question: "What types of courses are available at Makalla Code Academy?",
        answer:
          "Makalla Code Academy offers a variety of courses including Full Stack Web Development, Mobile App Development, Video Editing, Graphics Design, and Basic Computer Skills. We provide both beginner-friendly and advanced-level courses to cater to learners at every stage of their learning journey.",
      }
,      
    {
      question: "Is there any support for students during the courses?",
      answer:
        "Absolutely! Our team of instructors and teaching assistants are available to support you throughout the course. You can reach out to them for guidance via forums, live chat, or email.",
    },
    
  ];
  

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null); // Track active FAQ item

  const handleToggle = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close if already open
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full h-min text-black my-5">
      <h2 className="text-2xl font-bold text-center font-serif mb-5">
        Frequently Asked Questions
      </h2>
      <div className="flex justify-center px-5">
        <div className="w-full md:w-[50%] space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isActive={activeIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
