import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ArticleData } from '../data/articles';
import { getArticleBySlug } from '../data/articles';
import './Article.css';

interface ArticleProps {
  article?: ArticleData;
}

const Article: React.FC<ArticleProps> = ({ article: propArticle }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = propArticle || (slug ? getArticleBySlug(slug) : null);

  useEffect(() => {
    if (article) {
      // Update document title and meta tags for SEO
      document.title = `${article.title} | Frequency Zen`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', article.metaDescription);
      }

      // Add structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.metaDescription,
        "image": article.image || "https://zoneout.space/zen_frequency_logo.png",
        "author": {
          "@type": "Organization",
          "name": "Frequency Zen"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Frequency Zen",
          "logo": {
            "@type": "ImageObject",
            "url": "https://zoneout.space/zen_frequency_logo.png"
          }
        },
        "datePublished": article.datePublished,
        "dateModified": article.dateModified || article.datePublished,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://zoneout.space/articles/${article.slug}`
        }
      };

      // Add FAQ schema if questions exist
      if (article.faq && article.faq.length > 0) {
        structuredData["mainEntity"] = {
          "@type": "FAQPage",
          "mainEntity": article.faq.map(q => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };
      }

      // Remove old structured data script if exists
      const oldScript = document.getElementById('article-structured-data');
      if (oldScript) {
        oldScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.id = 'article-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Add breadcrumb schema
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'breadcrumb-structured-data';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://zoneout.space"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": article.title,
            "item": `https://zoneout.space/articles/${article.slug}`
          }
        ]
      });
      document.head.appendChild(breadcrumbScript);

      return () => {
        // Cleanup
        const scriptToRemove = document.getElementById('article-structured-data');
        const breadcrumbToRemove = document.getElementById('breadcrumb-structured-data');
        if (scriptToRemove) scriptToRemove.remove();
        if (breadcrumbToRemove) breadcrumbToRemove.remove();
      };
    }
  }, [article]);

  if (!article) {
    return (
      <div className="article-container">
        <div className="article-not-found">
          <h1>Article Not Found</h1>
          <p>The article you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-container">
      <article className="article-content">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          {article.metaDescription && (
            <p className="article-excerpt">{article.metaDescription}</p>
          )}
          <div className="article-meta">
            <time dateTime={article.datePublished}>
              {new Date(article.datePublished).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="article-reading-time">
              {Math.ceil(
                article.content.reduce((acc, section) => {
                  const words = (section.paragraphs?.join(' ') || '').split(' ').length +
                                (section.list?.join(' ') || '').split(' ').length;
                  return acc + words;
                }, 0) / 200
              )} min read
            </span>
          </div>
        </header>

        <div className="article-body">
          {article.content.map((section, index) => (
            <section key={index} className="article-section">
              {section.heading && (
                <h2 className="section-heading">{section.heading}</h2>
              )}
              {section.paragraphs && section.paragraphs.map((para, pIndex) => (
                <p key={pIndex} className="section-paragraph">{para}</p>
              ))}
              {section.list && (
                <ul className="section-list">
                  {section.list.map((item, lIndex) => (
                    <li key={lIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {article.faq && article.faq.length > 0 && (
          <section className="article-faq">
            <h2 className="faq-heading">Frequently Asked Questions</h2>
            <div className="faq-list">
              {article.faq.map((item, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">{item.question}</h3>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="article-related">
            <h2 className="related-heading">Related Articles</h2>
            <ul className="related-list">
              {article.relatedArticles.map((related, index) => (
                <li key={index}>
                  <a 
                    href={`/articles/${related.slug}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/articles/${related.slug}`);
                    }}
                    className="related-link"
                  >
                    {related.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        
        <div className="article-cta">
          <p className="cta-text">Ready to experience these frequencies?</p>
          <button 
            onClick={() => navigate('/')} 
            className="cta-button"
          >
            Try Frequency Zen Free
          </button>
        </div>
      </article>
    </div>
  );
};

export default Article;

