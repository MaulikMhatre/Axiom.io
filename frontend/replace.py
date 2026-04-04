import os

replacements = {
    'bg-black ': 'bg-zinc-50 dark:bg-black ',
    'bg-black"': 'bg-zinc-50 dark:bg-black"',
    'bg-black/10': 'bg-black/5 dark:bg-black/10',
    'bg-black/20': 'bg-white dark:bg-black/20',
    'bg-black/30': 'bg-white dark:bg-black/30',
    'bg-black/40': 'bg-white dark:bg-black/40',
    'bg-black/50': 'bg-white dark:bg-black/50',
    'text-white': 'text-zinc-900 dark:text-white',
    'text-zinc-100': 'text-zinc-900 dark:text-zinc-100',
    'text-zinc-200': 'text-zinc-800 dark:text-zinc-200',
    'text-zinc-300': 'text-zinc-700 dark:text-zinc-300',
    'text-zinc-400': 'text-zinc-600 dark:text-zinc-400',
    'text-zinc-500': 'text-zinc-500 dark:text-zinc-500',
    'bg-white/5': 'bg-black/[0.03] dark:bg-white/5',
    'bg-white/10': 'bg-black/[0.05] dark:bg-white/10',
    'bg-white/[0.02]': 'bg-white border-zinc-200 shadow-sm dark:bg-white/[0.02]',
    'bg-white/[0.01]': 'bg-white border-zinc-200 shadow-sm dark:bg-white/[0.01]',
    'bg-indigo-500/[0.02]': 'bg-indigo-50 dark:bg-indigo-500/[0.02]',
    'bg-rose-500/[0.02]': 'bg-rose-50 dark:bg-rose-500/[0.02]',
    'border-white/5': 'border-black/5 dark:border-white/5',
    'border-white/10': 'border-black/10 dark:border-white/10',
}

paths_to_check = ['app', 'components']

for d in paths_to_check:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                for k, v in replacements.items():
                    content = content.replace(k, v)
                
                # Cleanup potential double replacements
                content = content.replace('text-zinc-900 dark:text-zinc-900 dark:text-white', 'text-zinc-900 dark:text-white')
                content = content.replace('bg-zinc-50 dark:bg-zinc-50 dark:bg-black', 'bg-zinc-50 dark:bg-black')
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f'Updated {filepath}')
