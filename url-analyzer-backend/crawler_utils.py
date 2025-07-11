# crawler.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def analyze_url(url):
    response = requests.get(str(url))
    soup = BeautifulSoup(response.text, "html.parser")

    html_tag = soup.find("html")
    html_version = html_tag.get("version") if html_tag and html_tag.has_attr("version") else "HTML5 or unknown"
    title = soup.title.string.strip() if soup.title and soup.title.string else "No Title"
    headings = {f"h{i}": len(soup.find_all(f"h{i}")) for i in range(1, 7)}

    domain = urlparse(str(url)).netloc
    internal_links = []
    external_links = []

    all_links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("http"):
            all_links.append(href)
            if domain in urlparse(href).netloc:
                internal_links.append(href)
            else:
                external_links.append(href)

    login_form = any("password" in i.get("type", "").lower() for i in soup.find_all("input"))

    # ✅ Broken link kontrolü burada:
    broken_links = check_broken_links(all_links)

    return {
        "title": title,
        "html_version": html_version,
        "headings": headings,
        "internal_links": len(internal_links),
        "external_links": len(external_links),
        "has_login_form": login_form,
        "broken_links": broken_links  # ✅ yeni veri alanı
    }

    
def check_broken_links(links):
    broken = []
    for link in links:
        try:
            response = requests.head(link, allow_redirects=True, timeout=5)
            if response.status_code >= 400:
                broken.append({"url": link, "status": response.status_code})
        except Exception as e:
            broken.append({"url": link, "status": "error"})
    return broken