"""
Management command to seed the database with initial Ayahs and Guidance content.

Usage:
    python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from core.models import Ayah, GuidanceTopic, GuidanceEntry


AYAHS = [
    {
        'arabic':   'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        'text':     'Verily, with hardship comes ease.',
        'surah':    'Ash-Sharh',
        'ayah_ref': '94:6',
        'mood':     'lost',
        'is_daily': True,
    },
    {
        'arabic':   'وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
        'text':     'And He found you lost and guided you.',
        'surah':    'Ad-Duha',
        'ayah_ref': '93:7',
        'mood':     'lost',
        'is_daily': False,
    },
    {
        'arabic':   'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
        'text':     'Allah does not burden a soul beyond what it can bear.',
        'surah':    'Al-Baqarah',
        'ayah_ref': '2:286',
        'mood':     'anxious',
        'is_daily': True,
    },
    {
        'arabic':   'إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ',
        'text':     'Unquestionably, the mercy of Allah is near to the doers of good.',
        'surah':    'Al-A\'raf',
        'ayah_ref': '7:56',
        'mood':     'hopeful',
        'is_daily': False,
    },
    {
        'arabic':   'فَاذْكُرُونِي أَذْكُرْكُمْ',
        'text':     'So remember Me; I will remember you.',
        'surah':    'Al-Baqarah',
        'ayah_ref': '2:152',
        'mood':     'general',
        'is_daily': False,
    },
    {
        'arabic':   'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
        'text':     'He is with you wherever you are.',
        'surah':    'Al-Hadid',
        'ayah_ref': '57:4',
        'mood':     'lost',
        'is_daily': False,
    },
    {
        'arabic':   'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
        'text':     'And when My servants ask about Me — I am near.',
        'surah':    'Al-Baqarah',
        'ayah_ref': '2:186',
        'mood':     'anxious',
        'is_daily': False,
    },
    {
        'arabic':   'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
        'text':     'If you are grateful, I will surely increase you.',
        'surah':    'Ibrahim',
        'ayah_ref': '14:7',
        'mood':     'grateful',
        'is_daily': False,
    },
    {
        'arabic':   'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        'text':     'Indeed, Allah is with the patient.',
        'surah':    'Al-Baqarah',
        'ayah_ref': '2:153',
        'mood':     'anxious',
        'is_daily': False,
    },
    {
        'arabic':   'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
        'text':     'And whoever relies upon Allah — then He is sufficient for him.',
        'surah':    'At-Talaq',
        'ayah_ref': '65:3',
        'mood':     'hopeful',
        'is_daily': False,
    },
]

GUIDANCE = [
    {
        'slug': 'tawakkul',
        'title': 'Tawakkul',
        'subtitle': 'Trust in Allah',
        'entries': [
            ('Tawakkul is not passive waiting — it is taking action with full trust that Allah controls outcomes.', False),
            ('"And whoever relies upon Allah — then He is sufficient for him." (65:3)', True),
            ('Plant your seed, water it with du\'a, then leave the harvest to Him.', False),
        ],
    },
    {
        'slug': 'sabr',
        'title': 'Sabr',
        'subtitle': 'Patience',
        'entries': [
            ('Sabr is not silence in suffering — it is choosing to remain close to Allah while you hurt.', False),
            ('"Indeed, Allah is with the patient." (2:153)', True),
            ('Your pain is not punishment. Sometimes it is preparation.', False),
        ],
    },
    {
        'slug': 'iman',
        'title': 'Iman',
        'subtitle': 'Faith',
        'entries': [
            ('Iman breathes. It rises and falls. Nurture it gently, like a flame in wind.', False),
            ('"Renew your faith by saying Lā ilāha illā Allāh." (Ahmad)', True),
            ('Even small acts done with sincere intention illuminate the heart.', False),
        ],
    },
    {
        'slug': 'shukr',
        'title': 'Shukr',
        'subtitle': 'Gratitude',
        'entries': [
            ('Shukr is noticing the quiet gifts — breath, sight, a heart still beating toward Allah.', False),
            ('"If you are grateful, I will surely increase you." (14:7)', True),
            ('Gratitude is the fastest path back to peace.', False),
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed the database with initial Ayahs and Guidance content'

    def handle(self, *args, **options):
        self.stdout.write('🌙 Seeding database...\n')

        # ── Ayahs ──
        created_ayahs = 0
        for data in AYAHS:
            _, created = Ayah.objects.get_or_create(
                ayah_ref=data['ayah_ref'],
                defaults=data,
            )
            if created:
                created_ayahs += 1

        self.stdout.write(
            self.style.SUCCESS(f'  ✓ {created_ayahs} Ayahs created ({len(AYAHS) - created_ayahs} already existed)')
        )

        # ── Guidance ──
        created_topics = 0
        for g in GUIDANCE:
            entries = g.pop('entries')
            topic, created = GuidanceTopic.objects.get_or_create(
                slug=g['slug'], defaults=g
            )
            if created:
                created_topics += 1
                for i, (text, is_ayah) in enumerate(entries):
                    GuidanceEntry.objects.create(
                        topic=topic, text=text, is_ayah=is_ayah, order=i
                    )

        self.stdout.write(
            self.style.SUCCESS(f'  ✓ {created_topics} Guidance topics created')
        )

        self.stdout.write('\n✨ Done! Your database is ready.\n')
        self.stdout.write('   Next: python manage.py createsuperuser\n')