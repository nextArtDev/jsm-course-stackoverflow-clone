// Remove diacritics
let normalizedSearch = removeDiacritics(searchQuery);

// Escape regex special characters  
normalizedSearch = normalizedSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

// Build regex with options
const searchRegex = new RegExp(`\\b${normalizedSearch}\\b`, 'iu');

// Regex alternatives
searchRegex.alternatives = [
  // Similar letters
  /ض/iu, /ص/iu, /ث/iu, /ق/iu, /ف/iu,
  /ع/iu, /ه/iu, /خ/iu, /ح/iu, /ج/iu,
  /چ/iu, /ش/iu, /س/iu, /ی/iu, /ب/iu,
  /ل/iu, /ا/iu, /ت/iu, /ن/iu, /م/iu,
  /ک/iu, /گ/iu, /و/iu,

  // Diacritic forms
  /کِ/iu, /گِ/iu, /وِ/iu,  
  /اِ/iu, /آ/iu, /لا/iu
];

//////////////////////////////////
model Question {
  title      String  @db.VarChar(255)
  normalizedTitle String? @db.VarChar(255)
  content    String?
  normalizedContent String?

  @@index([normalizedTitle], type: FULLTEXT)
  @@index([normalizedContent], type: FULLTEXT)
}

Normalizing in this context refers to transforming the text to a common format to improve search accuracy. Some examples of normalization:

Remove diacritics - Languages like Persian have additional characters and markings like تِ , چَ etc. Removing these allows finding matches regardless of diacritics.

Case folding - Convert all text to lower/upper case. This allows finding words regardless of case.

Stemming - Reduce words to their root form. For example search for 'running' can also match 'run'.

Remove punctuation - Strip punctuation characters so they don't interfere with matching.

The goal is to transform the search query and database content to a common encoding that allows finding more matches despite superficial differences in spelling, case, conjugations etc.

By normalizing before storing the content in the database, and normalizing search queries on input, the search process becomes more flexible. Words can be matched despite minor differences in spelling or conjugation.

Some languages require more aggressive normalization than others. Languages like Persian with additional diacritics require at least diacritic removal. Stemming may also help with languages that have extensive conjugations.

Let me know if this helps explain the purpose and common techniques for text normalization!

// Normalize to remove diacritics
const normalizedSearchQuery = removeDiacritics(searchQuery)

where.OR = [
  {
    title: {
      mode: 'insensitive',
      search: normalizedSearchQuery
    }
  },
  {
    content: {
      mode: 'insensitive',
      search: normalizedSearchQuery
    }
  }
]

//////////////////////////////
let normalizedSearch = removeDiacritics(searchQuery);
normalizedSearch = normalizedSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');  

const baseRegex = new RegExp(`\\b${normalizedSearch}\\b`, 'iu');
const alternatives = '|ض|ص|ث|ق|ف|ع|ه|خ|ح|ج|چ|ش|س|ی|ب|ل|ا|ت|ن|م|ک|گ|و|کِ|گِ|وِ|اِ|آ|لا';  
const searchRegex = new RegExp(`${baseRegex.source}${alternatives}`, 'iu');

const questions = await prisma.question.findMany({
  where: {
    OR: [
      {
        title: {
          matches: {
            _regex: searchRegex.source,  
          }
        }
      },
      {
        content: {
          matches: {
            _regex: searchRegex.source,
          }
        }
      }
    ]
  }
});

const searchRegex = //...construct regex

const questions = await prisma.question.findMany({
  where: {
    OR: [
      {
        title: {
          matches: {
            _regex: searchRegex.source,  
          }
        }
      },
      {
        content: {
          matches: {
            _regex: searchRegex.source,
          }
        }
      }
    ],
  },
});
