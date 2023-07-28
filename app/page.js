
'use client'
import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

const TextDetector = () => {
  <Analytics />
  const versionNumber = "1.0.4";
  const [inputText, setInputText] = useState('');
  const [detectedSentences, setDetectedSentences] = useState([]);
  const [fakePercentage, setFakePercentage] = useState([0]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [alert, setAlert] = useState('');

  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (e) => {
    const text = e.target.value;
    //! Max 10 000 characters
    setInputText(text.slice(0, 10000));

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

      

      if (inputText < 20) {
        setAlert('Please enter at least 20 characters.');
        return 
      }
      setButtonDisabled(true);

      const response = await fetch('https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': "c77e5ebb21msh5d4e12f17e1886dp106974jsnd58c7fc3d677",
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

      setButtonDisabled(false);


    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
      <div className="flex items-center text-center">
        <h1 className="text-5xl font-bold mt-6 text-4xl">AI Text Detector</h1>
        <small className="text-gray-600">{versionNumber}</small>
      </div>
      <h1 className="text-2xl font-thin mt-6 text-center max-sm:text-xl">Artificial intelligence detection over <del>multiple</del>, for now, one source of validation</h1>
      
      <div className="bg-neutral-800 rounded-lg md:w-3/4 md:place-items-center md:mt-12 max-sm:w-screen">
      <div className="md:flex md:flex md:items-center md:justify-center max-sm:min-h-screen centered-child ">
        <div className="md:w-1/2 p-6 ">
        <textarea className="w-full h-48 p-2 border bg-neutral-800 text-gray-400 rounded "  value={inputText}
        onChange={handleInputChange}/>
        <div className="mt-2 text-center">
        <p>{alert}</p>
        <button className={`mt-4 px-4 py-2 bg-purple-800 hover:bg-purple-600 text-white rounded ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} maxLength={10000} onClick={analyzeText} disabled={isButtonDisabled}>Analyze Text</button>
        
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
    <div className="flex flex-col items-center font-light">
      <a
        href="https://w01f.fr"
        className="text-center text-md font-light hover:bg-purple-800 text-gray-500"
      >
        Made with ♥ by w01f
      </a>
    </div>
    </div>
  );
};


export default TextDetector;
