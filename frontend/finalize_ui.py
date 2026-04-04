import os
import re

def clean_classes(text):
    # Regex for finding className="..." or similar patterns
    pattern = r'(className|class)\s*=\s*([\"\'`])(.*?)\2'
    
    def re_replace(match):
        prefix = match.group(1)
        quote = match.group(2)
        classes = match.group(3)
        
        # Cleanup font sizes the user requested to be "proper" (larger)
        classes = classes.replace('text-[9px]', 'text-xs')
        classes = classes.replace('text-[10px]', 'text-xs')
        classes = classes.replace('text-[11px]', 'text-sm')
        classes = classes.replace('text-xs', 'text-sm')
        classes = classes.replace('text-sm', 'text-base')
        
        # Cleanup redundancy (dedup)
        tokens = classes.split()
        unique_tokens = []
        seen = set()
        for t in tokens:
            if t not in seen:
                unique_tokens.append(t)
                seen.add(t)
        
        # Specific fix for the messy dark: chains
        filtered_tokens = []
        for t in unique_tokens:
            if 'dark:text-zinc' in t and len(filtered_tokens) > 0 and 'dark:text-zinc' in filtered_tokens[-1]:
                continue
            filtered_tokens.append(t)
            
        return f'{prefix}={quote}{" ".join(filtered_tokens)}{quote}'

    # Apply multiple times to catch nested or complex structures
    new_text = re.sub(pattern, re_replace, text)
    
    # Final global safety cleanup for any text-zinc chains that might be outside of quotes
    new_text = re.sub(r'(dark:text-zinc-\d+\s*){2,}', 'dark:text-zinc-500 ', new_text)
    new_text = re.sub(r'(dark:text-indigo-\d+\s*){2,}', 'dark:text-indigo-400 ', new_text)
    
    return new_text

paths = ['app', 'components']

for d in paths:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = clean_classes(content)
                
                # Manual font weight / contrast boost pass for "proper" visibility
                # Headings H1/H2 should have strong contrast
                new_content = new_content.replace('text-zinc-600 dark:text-zinc-500', 'text-zinc-800 dark:text-zinc-200 font-bold')
                new_content = new_content.replace('text-zinc-700 dark:text-zinc-400', 'text-zinc-900 dark:text-zinc-100 font-extrabold')
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

print("Unified font size upgrade and theme code cleanup complete.")
