import glob
import re

files = [
    "src/app/page.tsx",
    "src/app/editor/page.tsx",
    "src/app/article/[id]/page.tsx",
    "src/app/search/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/about/page.tsx",
    "src/app/privacy/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/category/[slug]/page.tsx"
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace Instagram link
    content = content.replace('href="https://instagram.com"', 'href="https://www.instagram.com/byeolfather/"')
    
    if 'href="https://facebook.com"' in content:
        # Just replace the link
        content = content.replace('href="https://facebook.com"', 'href="https://www.facebook.com/Sightsynch/"')
    else:
        # Check if the dark variant is used
        if 'className="hover:text-black dark:hover:text-white transition-colors"' in content:
            className = 'className="hover:text-black dark:hover:text-white transition-colors"'
        else:
            className = 'className="hover:text-black transition-colors"'
            
        pattern = r'(aria-label="Instagram">.*?</svg>\n\s*</a>)'
        
        facebook_block = f"""
                <a href="https://www.facebook.com/Sightsynch/" target="_blank" rel="noopener noreferrer" {className} aria-label="Facebook">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>"""
        
        content = re.sub(pattern, r'\1' + facebook_block, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated all files")
