"use client";

import React, { useEffect } from 'react';

export default function CustomSubstackEmbed() {
  useEffect(() => {
    // Create script element for Substack widget
    const script = document.createElement('script');
    script.src = "https://substackapi.com/widget.js";
    script.async = true;

    // Create script element for custom configuration
    const configScript = document.createElement('script');
    configScript.textContent = `
      window.CustomSubstackWidget = {
        substackUrl: "ideagnose.substack.com",
        placeholder: "example@gmail.com",
        buttonText: "Subscribe",
        theme: "custom",
        colors: {
          primary: "#3B82F6",
          input: "gray-600",
          email: "#cecece",
          text: "#ffffff",
        }
      };
    `;

    // Append scripts to document
    document.body.appendChild(configScript);
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
      document.body.removeChild(configScript);
    };
  }, []);

  return <div id="custom-substack-embed"></div>;
}