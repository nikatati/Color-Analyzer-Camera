import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Palette } from "color-thief-react";
import "./App.css";
const ColorAnalyzer = () => {
  const [imageSrc, setImageSrc] = useState(null);

  const webcamRef = useRef(null);

  const captureFrame = async () => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrc(imageSrc);
      } catch (error) {
        console.error("Error capturing frame:", error);
      }
    } else {
      console.error("Error capturing frame: Webcam reference is undefined.");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(captureFrame, 850); // Update
    return () => clearInterval(intervalId);
  }, []);

  //hex format is #RRGGBB
  //The parseInt function with the base parameter set to 16 converts each substring from hexadecimal to decimal.
  function hexToRGBA(hex) {
    let r = parseInt(hex.substring(1, 3), 16); //Extracts the substring representing the red component
    let g = parseInt(hex.substring(3, 5), 16); //Extracts the substring representing the green component
    let b = parseInt(hex.substring(5, 7), 16); //Extracts the substring representing the blue component.
    return { r, g, b, a: 1 };
  }

  function getColorsWithPercentages(colors) {
    if (!colors) return [];

    let totalR = 0,
      totalG = 0,
      totalB = 0;

    let rgbColors = colors.map((color) => {
      let rgba = hexToRGBA(color);
      totalR += rgba.r;
      totalG += rgba.g;
      totalB += rgba.b;
      return rgba;
    });

    return rgbColors.map(({ r, g, b }) => {
      let total = totalR + totalG + totalB;
      let colorPercentage = ((r + g + b) / total) * 100;
      return {
        color: { r, g, b },
        percentage: colorPercentage.toFixed(2) + "%",
      };
    });
  }

  return (
    <div className="container">
      <Webcam ref={webcamRef} className="webcam" />
      <Palette
        src={imageSrc}
        crossOrigin="anonymous"
        format="hex"
        colorCount={5}
      >
        {({ data, loading }) => {
          if (loading) return <div>loading...</div>;

          const res = getColorsWithPercentages(data);

          return (
            <ul className="palette">
              <p className="title">חלוקת צבעים</p>
              {res?.map((colorObj, index) => (
                <li className="element" key={index}>
                  <h2
                    className="percentage-box"
                    style={{
                      backgroundColor: `rgba(${colorObj?.color.r},${colorObj?.color.g},${colorObj?.color.b})`,
                      color:
                        colorObj?.color.r > 200 &&
                        colorObj?.color.g > 200 &&
                        colorObj?.color.b > 200 &&
                        "black",
                    }}
                  >
                    {colorObj?.percentage}
                  </h2>
                  <p
                    className="color-font"
                    style={{
                      fontFamily: "colorFont",
                    }}
                  >
                    R:{colorObj?.color.r}, G:{colorObj?.color.g}, B:
                    {colorObj?.color.b}
                  </p>
                </li>
              ))}
            </ul>
          );
        }}
      </Palette>
    </div>
  );
};

export default ColorAnalyzer;
