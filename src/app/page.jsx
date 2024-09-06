"use client";
import React from "react";
import { useEffect, useState } from "react";

function MainComponent() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const translatedArticles = await Promise.all(
        data.articles.map(async (article) => {
          const titleResponse = await fetch(
            "/integrations/google-translate/language/translate/v2",
            {
              method: "POST",
              body: new URLSearchParams({
                q: article.title,
                target: "ja",
              }),
            }
          );
          const titleData = await titleResponse.json();
          const descriptionResponse = await fetch(
            "/integrations/google-translate/language/translate/v2",
            {
              method: "POST",
              body: new URLSearchParams({
                q: article.description,
                target: "ja",
              }),
            }
          );
          const descriptionData = await descriptionResponse.json();
          return {
            ...article,
            translatedTitle: titleData.data.translations[0].translatedText,
            translatedDescription:
              descriptionData.data.translations[0].translatedText,
          };
        })
      );
      setNews(translatedArticles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-pixelify-sans p-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
        海外AIニュース
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border-4 border-black p-6 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-shadow duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-4">
              {article.translatedTitle}
            </h2>
            <p className="mb-4">{article.translatedDescription}</p>
            <div className="flex justify-between items-center text-sm">
              <span>{article.source.name}</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default MainComponent;