async function fetchMediumArticles() {
    try {
        // Fetch Medium RSS feed through a CORS proxy
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@mertozseven');
        const data = await response.json();
        
        if (data.items) {
            const articlesContainer = document.getElementById('medium-articles');
            data.items.slice(0, 6).forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card';
                
                // Extract first image from content if available
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = article.content;
                const firstImage = tempDiv.querySelector('img');
                const imageUrl = firstImage ? firstImage.src : 'https://miro.medium.com/max/1200/1*jfdwtvU6V6g99q3G7gq7dQ.png';
                
                // Create article card structure
                const imageDiv = document.createElement('div');
                imageDiv.className = 'article-image';
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = article.title;
                img.loading = 'lazy'; // Add lazy loading
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'article-content';
                contentDiv.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.pubDate.split(' ')[0]}</p>
                `;
                
                imageDiv.appendChild(img);
                articleCard.appendChild(imageDiv);
                articleCard.appendChild(contentDiv);
                
                articleCard.addEventListener('click', () => {
                    window.open(article.link, '_blank');
                    // Google Analytics event tracking
                    gtag('event', 'article_click', {
                        'event_category': 'Engagement',
                        'event_label': article.title
                    });
                });
                
                articlesContainer.appendChild(articleCard);
            });
        }
    } catch (error) {
        console.error('Error fetching Medium articles:', error);
    }
}

async function fetchGithubRepositories() {
    try {
        const response = await fetch('https://api.github.com/users/mertozseven/repos?sort=updated&per_page=8');
        const repos = await response.json();
        
        const reposContainer = document.getElementById('github-repos');
        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            
            repoCard.innerHTML = `
                <div class="repo-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span>${repo.language || 'N/A'}</span>
                    </div>
                </div>
            `;
            
            repoCard.addEventListener('click', () => {
                window.open(repo.html_url, '_blank');
                // Google Analytics event tracking
                gtag('event', 'repository_click', {
                    'event_category': 'Engagement',
                    'event_label': repo.name
                });
            });
            
            reposContainer.appendChild(repoCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
    }
}

// Update theme color meta tag
function updateThemeColor() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeColor = isDark ? '#000000' : '#f5f5f7';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update theme color on load
    updateThemeColor();
    
    // Listen for color scheme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(updateThemeColor);
    fetchMediumArticles();
    fetchGithubRepositories();
});
