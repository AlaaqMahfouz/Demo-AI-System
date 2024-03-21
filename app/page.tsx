'use client'

import React, { useState, useEffect } from 'react';

const yamlTemplate = `
name: ''
phoneNumbers:
  - ''
websites:
  - ''
emails:
  - ''
dateOfBirth: ''
addresses:
  - street: ''
    city: ''
    state: ''
    zip: ''
    country: ''
summary: ''
education:
  - school: ''
    degree: ''
    fieldOfStudy: ''
    startDate: ''
    endDate: ''
workExperience:
  - company: ''
    position: ''
    startDate: ''
    endDate: ''
skills:
  - name: ''
certifications:
  - name: ''
`;

const CvParser: React.FC = () => {
  const [parsedYaml, setParsedYaml] = useState<string>(''); // State to hold parsed YAML
  const [isLoading, setIsLoading] = useState(false); // State to indicate loading state

  const token = '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'; // Replace with your OpenAI API key

  const cvText = `
Curriculum Vitae
Gebran Elias Nemes
Personal Information
• Full Name: Gebran Elias Nemes • Phone Number: +96170998429 • E-mail: gebrannemes2003@gmail.com
Academics
• School: Collège St. Elie Btina, Beirut, Lebanon (2006-2021)
• University: 3
rd year Bachelor in Computer Science, Lebanese University, Faculty of Science II, Fanar, Lebanon (2021 - Present)
• Relevant Coursework: React, HTML/CSS/JavaScript, SQL.
• Other Coursework: C, C++, Java, Assembly, Prolog, Networking, MATLAB, Android.
• Platforms: VScode, Eclipse, Android Studio, VS2022, Oracle, ide68000, MATLAB, Packet Tracer, Visual Paradigm, 
GitHub.
Experience & Certifications
• Developed a front-end website project during the second year of university, utilizing HTML, CSS, and JavaScript. 
(https://github.com/GN1370/Better-Mental-State.git)
• Developed a React-based online marketplace project during the current third year of university, utilizing React (libraries axios,
react router dom, express, cors), JavaScript, HTML, CSS, Tailwind CSS, Flowbite-React, MySQL.
• Developed React project during the current third year of university, utilizing Android (Asynctask), PhpMyAdmin.
• Obtained the Lebanese Civil Defence Certificate. (2023)
• Attended the IEEE Clustering Techniques Certificate program. (January 2022)
• Provided private tutoring in all subjects for school students in Arabic, French and English since 2014.
Personal Traits
• Problem Solving
• Attention to Detail
• Responsibility
• Team Spirit
• Sportsmanship
• Leadership Skills
• Helping Others
Skills and Hobbies
• Scout. (2009 - Present)
• Film-Making/Acting.
• Photography.
• Arts & Crafts.
• Drawing/Painting.
• Cooking/Baking.
• Swimming/Shallow Diving
Languages
• Arabic (Native, Fluent) • French (Fluent) • English (Fluent)
`; // Predefined resume content string

  useEffect(() => {
    const parseCv = async () => {
      setIsLoading(true);

      const gptPrompt = `This is a resume:\n${cvText}\nPlease parse the information into a YAML format following the structure:\n${yamlTemplate}`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
              {
                "role": "user",
                "content": gptPrompt,
              }
            ]
          })
        });

        const data = await response.json();
        
        const parsedContent = data.choices[0].message.content;

        setParsedYaml(parsedContent);

        console.log("Parsed YAML:", parsedYaml);

      } catch (error) {
        console.error('Error parsing CV:', error);
      } finally {
        setIsLoading(false);
      }
    };

    parseCv(); // Call parsing function on component mount
  }, []); // Empty dependency array to run parsing only once

  return (
    <div>
      <h1>Parse Your Resume to YAML</h1>
      {isLoading ? (
        <p>Parsing your resume...</p>
      ) : (
        <pre>
          {parsedYaml}
        </pre>
      )}
    </div>
  );
};

export default CvParser;




// // 'use client'

// // export default function parseCvToYaml() {

// //   const gptEl = document.getElementById('result_of_gpt');

// //   const yamlTemplate = `
// // name: ''
// // phoneNumbers:
// //   - ''
// // websites:
// //   - ''
// // emails:
// //   - ''
// // dateOfBirth: ''
// // addresses:
// //   - street: ''
// //     city: ''
// //     state: ''
// //     zip: ''
// //     country: ''
// // summary: ''
// // education:
// //   - school: ''
// //     degree: ''
// //     fieldOfStudy: ''
// //     startDate: ''
// //     endDate: ''
// // workExperience:
// //   - company: ''
// //     position: ''
// //     startDate: ''
// //     endDate: ''
// // skills:
// //   - name: ''
// // certifications:
// //   - name: ''
// // `;

// // // resume content
// // const cvText =`
// // Curriculum Vitae
// // Gebran Elias Nemes
// // Personal Information
// // • Full Name: Gebran Elias Nemes • Phone Number: +96170998429 • E-mail: gebrannemes2003@gmail.com
// // Academics
// // • School: Collège St. Elie Btina, Beirut, Lebanon (2006-2021)
// // • University: 3
// // rd year Bachelor in Computer Science, Lebanese University, Faculty of Science II, Fanar, Lebanon (2021 - Present)
// // • Relevant Coursework: React, HTML/CSS/JavaScript, SQL.
// // • Other Coursework: C, C++, Java, Assembly, Prolog, Networking, MATLAB, Android.
// // • Platforms: VScode, Eclipse, Android Studio, VS2022, Oracle, ide68000, MATLAB, Packet Tracer, Visual Paradigm, 
// // GitHub.
// // Experience & Certifications
// // • Developed a front-end website project during the second year of university, utilizing HTML, CSS, and JavaScript. 
// // (https://github.com/GN1370/Better-Mental-State.git)
// // • Developed a React-based online marketplace project during the current third year of university, utilizing React (libraries axios,
// // react router dom, express, cors), JavaScript, HTML, CSS, Tailwind CSS, Flowbite-React, MySQL.
// // • Developed React project during the current third year of university, utilizing Android (Asynctask), PhpMyAdmin.
// // • Obtained the Lebanese Civil Defence Certificate. (2023)
// // • Attended the IEEE Clustering Techniques Certificate program. (January 2022)
// // • Provided private tutoring in all subjects for school students in Arabic, French and English since 2014.
// // Personal Traits
// // • Problem Solving
// // • Attention to Detail
// // • Responsibility
// // • Team Spirit
// // • Sportsmanship
// // • Leadership Skills
// // • Helping Others
// // Skills and Hobbies
// // • Scout. (2009 - Present)
// // • Film-Making/Acting.
// // • Photography.
// // • Arts & Crafts.
// // • Drawing/Painting.
// // • Cooking/Baking.
// // • Swimming/Shallow Diving
// // Languages
// // • Arabic (Native, Fluent) • French (Fluent) • English (Fluent)
// // `; // resume text string

// //   const token = `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`;
  
// //   const gptPrompt = `This is a resume:\n${cvText}\nPlease parse the information into a YAML format following the structure:\n${yamlTemplate}`;

// //   fetch('https://api.openai.com/v1/chat/completions', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       'Authorization': 'Bearer ' + token,
// //     },
// //     body: JSON.stringify({
// //       "model": "gpt-3.5-turbo",
// //       "messages": [
// //         {
// //           "role": "user",
// //           "content": gptPrompt,
// //         }
// //       ]
// //     })
// //   })
// //   .then(response => response.json())
// //   .then(result => {
// //     const parsedYaml = result.choices[0].message.content;
// //     console.log("Parsed YAML:", parsedYaml);
// //     if (gptEl) {
// //       gptEl.innerText = parsedYaml;
// //     } else {
// //       console.error("Element with ID 'result_of_gpt' not found!");
// //     }
// //   })
// //   .catch(error => {
// //     console.error(error);
// //   });
  
// //   return(
// //     <div>
// //       <h1>GPT Response: </h1>
// //       <div id="result_of_gpt"></div>
// //       <button onClick={parseCvToYaml}>Parse Resume</button>
// //     </div>
// //   );
// // }
