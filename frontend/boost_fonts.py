import os
import re

font_size_reps = {
    'text-[8px]': 'text-[11px]',
    'text-[9px]': 'text-xs',
    'text-[10px]': 'text-xs',
    'text-[11px]': 'text-sm',
    'text-xs': 'text-sm',
    'text-sm': 'text-base',
    'tracking-[0.4em]': 'tracking-[0.2em]', # Reduce extreme tracking for better readability
    'tracking-[0.3em]': 'tracking-[0.15em]',
    'tracking-[0.5em]': 'tracking-[0.2em]',
}

# Specific contrast fixes for both themes
contrast_reps = {
    'text-slate-500': 'text-zinc-600 dark:text-zinc-400',
    'text-zinc-500': 'text-zinc-600 dark:text-zinc-400',
    'text-zinc-600': 'text-zinc-700 dark:text-zinc-400',
    'text-zinc-700': 'text-zinc-800 dark:text-zinc-300',
    'text-zinc-400': 'text-zinc-600 dark:text-zinc-400',
    'text-indigo-400': 'text-indigo-600 dark:text-indigo-400',
    'font-black': 'font-black', # Headings stay black
    'font-bold': 'font-extrabold', # Boost bold to extrabold for visibility
    'font-medium': 'font-bold', # Boost medium to bold
}

paths = ['app', 'components']

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Update font sizes
    for k, v in font_size_reps.items():
        # Match only full class names, avoid partial matches like text-xs-something
        content = re.sub(rf'\b{re.escape(k)}\b', v, content)
        
    # 2. Update contrast and weights
    for k, v in contrast_reps.items():
        content = re.sub(rf'\b{re.escape(k)}\b', v, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

updated_count = 0
for d in paths:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx'):
                if update_file(os.path.join(root, file)):
                    updated_count += 1

print(f"Upgraded typography in {updated_count} files for maximum legibility.")
