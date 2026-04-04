import os
import re

# Map hardcoded dark hex backgrounds to light/dark variants
hardcoded_dark_bg = {
    'bg-[#09090b]': 'bg-white dark:bg-[#09090b]',
    'bg-[#020203]': 'bg-white dark:bg-[#020203]',
    'bg-[#0c0c0e]': 'bg-zinc-50 dark:bg-[#0c0c0e]',
    'bg-[#050505]': 'bg-white dark:bg-[#050505]',
    'bg-[#1c1c1e]': 'bg-zinc-50 dark:bg-[#1c1c1e]',
    'bg-[#18181b]': 'bg-zinc-50 dark:bg-[#18181b]',
    'bg-zinc-900': 'bg-zinc-100 dark:bg-zinc-900',
    'bg-zinc-800': 'bg-zinc-200 dark:bg-zinc-800',
    'text-zinc-900/40': 'text-zinc-900/20 dark:text-zinc-900/40',
    'border-zinc-800': 'border-zinc-200 dark:border-zinc-800',
    'border-zinc-900': 'border-zinc-200 dark:border-zinc-900',
    'bg-zinc-950': 'bg-zinc-100 dark:bg-zinc-950',
    'text-zinc-900': 'text-zinc-900 dark:text-zinc-100',
}

# More targeted text/bg replacements
light_replaceable = {
    # Specific non-theme respecting loading screens
    'min-h-screen bg-[#09090b]': 'min-h-screen bg-white dark:bg-[#09090b]',
    'min-h-screen bg-[#020203]': 'min-h-screen bg-white dark:bg-[#020203]',
    # Card/section backgrounds
    'bg-[#0c0c0e] border border-zinc-800': 'bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800',
    'bg-[#0c0c0e] border border-black/5': 'bg-zinc-50 dark:bg-[#0c0c0e] border border-zinc-200 dark:border-black/5',
    # Inline button/badge styles
    'bg-zinc-900 border border-zinc-800': 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
    'bg-indigo-500/10 border border-indigo-500/20': 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20',
    'text-zinc-600': 'text-zinc-600 dark:text-zinc-400',
    'text-zinc-700': 'text-zinc-600 dark:text-zinc-500',
    # Github page specific
    'stroke="#27272a"': 'stroke="#d4d4d8"',
}

paths_to_check = ['app', 'components']

updated_files = []
for d in paths_to_check:
    for root, dirs, files in os.walk(d):
        # Skip node_modules and .next
        dirs[:] = [dd for dd in dirs if dd not in ['node_modules', '.next', '.git']]
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content

                # Apply specific replacements (check not already done)
                for k, v in light_replaceable.items():
                    if k in content and v not in content:
                        content = content.replace(k, v)

                # Apply individual class replacements carefully
                for k, v in hardcoded_dark_bg.items():
                    # Make sure we only add dark: prefix if not already there
                    if v not in content and k in content:
                        content = content.replace(k, v)

                # Cleanup accidental double replacements
                content = content.replace('bg-white dark:bg-white dark:', 'bg-white dark:')
                content = content.replace('text-zinc-900 dark:text-zinc-900 dark:text-zinc-100', 'text-zinc-900 dark:text-zinc-100')
                content = content.replace('text-zinc-600 dark:text-zinc-600 dark:text-zinc-400', 'text-zinc-600 dark:text-zinc-400')
                content = content.replace('bg-zinc-100 dark:bg-zinc-100 dark:bg-zinc-900', 'bg-zinc-100 dark:bg-zinc-900')
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    updated_files.append(filepath)

print(f"Updated {len(updated_files)} files:")
for f in updated_files:
    print(f"  - {f}")
