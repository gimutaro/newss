import { NextResponse } from 'next/server';

export async function POST() {
    const url = `https://newsapi.org/v2/top-headlines?q=generative%20AI&apiKey=${process.env.NEWS_API}`;
    const response = await fetch(url);

    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({
        status: data.status,
        totalResults: data.totalResults,
        articles: data.articles.map((article) => ({
            source: {
                id: article.source.id,
                name: article.source.name,
            },
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            content: article.content,
        })),
    });
}