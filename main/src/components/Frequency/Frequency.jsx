import React, { useState } from 'react';
import './Frequency.css';

const Frequency = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: "How do I get started?",
            answer: "When you sign up, you'll start with the Free plan, which includes limited features..."
        },
        {
            question: "What is a brain tumor?",
            answer: "A brain tumor is a growth of abnormal cells in the brain that can be benign (non-cancerous) or malignant (cancerous)..."
        },
        {
            question: "How is a brain tumor diagnosed?",
            answer: "Diagnosis typically involves a neurological exam, imaging tests (MRI or CT scans), and sometimes a biopsy..."
        },
        {
            question: "What are the common symptoms of a brain tumor?",
            answer: "Common symptoms include headaches, nausea, seizures, vision or speech problems, and changes in behavior or cognitive abilities..."
        },
        {
            question: "Who is at risk of developing a brain tumor?",
            answer: "Factors like family history, exposure to radiation, and certain genetic conditions can increase the risk, but anyone can develop a brain tumor..."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="fq-container">
            <div className="fq-header">
                <h1>Frequently Asked Questions</h1>
            </div>
            <div className="fq-search">
                <input type="text" placeholder="Search for a question" />
            </div>
            {faqData.map((item, index) => (
                <div
                    className={`fq-item ${openIndex === index ? 'open' : ''}`}
                    key={index}
                    onClick={() => toggleFAQ(index)}
                >
                    <div className="fq-question">
                        {item.question} <span>{openIndex === index ? '-' : '+'}</span>
                    </div>
                    <div className="fq-answer">
                        {item.answer}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Frequency;
