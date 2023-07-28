
'use client'
import React, { useState } from 'react';

const TextDetector = () => {
  const [inputText, setInputText] = useState('');
  const [detectedSentences, setDetectedSentences] = useState([]);
  const [fakePercentage, setFakePercentage] = useState([]);


  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    // Calculate word count
    const words = text.trim().split(/\s+/);
    setWordCount(words.filter((word) => word !== '').length);

    // Calculate character count
    setCharacterCount(text.length);
  };


  function highlightSentences(inputText, ArraySentences) {
    let highlightedText = inputText;
  
    ArraySentences.forEach((sentence) => {
      // Escape special characters in the sentence to ensure proper matching
      const escapedSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Use a regular expression to find the sentence and add the HTML <mark> tag for highlighting
      const regex = new RegExp(escapedSentence, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$&</mark>');
    });
  
    return highlightedText;
  }

  const ProgressBar = ({ percentage }) => {
    let progressBarStyle

    if (isNaN(percentage) || Array.isArray(percentage) && percentage.length === 0) {
       progressBarStyle = {
        width: "0%",
      };
    } else {
       progressBarStyle = {
        width: `${percentage}%`,
      };
    }
  
    return (
      <div className="mx-auto h-3 relative max-w-xl rounded-full overflow-hidden">
        <div className="w-full h-full bg-neutral-700 absolute"></div>
        <div id="progress-bar" className="transition-all ease-out duration-1000 h-full bg-gradient-to-r from-purple-900 to-purple-500 relative" style={progressBarStyle}></div>
      </div>
    );
  };
  

  const analyzeText = async () => {
    try {
      const response = await fetch('https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.API_KEY,
          'X-RapidAPI-Host': 'ai-content-detector-ai-gpt.p.rapidapi.com',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      // Assuming the API response has a property "detectedSentences" containing an array of detected sentences
      setDetectedSentences(data.aiSentences);
      setFakePercentage(data.fakePercentage);


    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
      <h1 className="text-5xl font-bold mt-6 text-4xl">AI Text Detector</h1>
      <h1 className="text-2xl font-thin mt-6 text-center max-sm:text-xl">Artificial intelligence detection over multiple sources of validation</h1>
      
      <div className="bg-neutral-800 rounded-lg md:w-3/4 md:place-items-center mt-12 max-sm:w-screen">
      <div className="md:flex md:flex md:items-center md:justify-center min-h-screen centered-child ">
        <div className="md:w-1/2 p-6 ">
        <textarea className="w-full h-48 p-2 border bg-neutral-800 text-gray-400 rounded "  value={inputText}
        onChange={handleInputChange}/>
        <div className="mt-2 text-center">
        <button className="mt-4 px-4 py-2 bg-purple-800 hover:bg-purple-600 text-white rounded" onClick={analyzeText}>Analyze Text</button>
        
        </div>  <div className="mt-2 text-center">
        <p className="text-gray-400">Word Count: {wordCount}</p>
        <p className="text-gray-400">Character Count: {characterCount}</p>
      </div>
      </div>
      <div className="md:w-1/2 md:mt-0 p-6 text-gray-400 mt-4 md:mt-0">
       {
          <div>
      
            <div className="mt-2 text-center">
            <p>Fake Percentage : {fakePercentage}%</p>

            <ProgressBar percentage={parseInt(fakePercentage)} />
            

         
            </div>

            <h2 className="text-xl mb-2 mt-4">Detected Sentences:</h2>
            <div class="scrollable-div">
            {detectedSentences.length > 0 ? (
              <p dangerouslySetInnerHTML={{ __html: highlightSentences(inputText, detectedSentences) }} ></p>
            ) : (
              <p>No sentences detected.</p>
            )}
            </div>
          </div>
        }
      </div>
      </div>
      <div>
    </div>
    </div>
    </div>
  );
};

export default TextDetector;

