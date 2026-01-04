import { IBulbData } from '../../src/models/Bulb/types';
import { ICategoryData } from '../../src/models/Category/types';
import { ReferenceSourceType, IReferenceSourceData } from '../../src/models/ReferenceSource/types';
import { ITagData } from '../../src/models/Tag/types';

export const CATEGORY_RECORDS: Array<ICategoryData> = [
  {
    name: 'Hobbies',
    description: 'About things I like to do.',
    statistics: {
      total_bulbs: 0,
    },
  },
  {
    name: 'Reflections',
    description: 'Thoughts about events happened in my life.',
    statistics: {
      total_bulbs: 0,
    },
  },
  {
    name: 'WorkStuffs',
    description: 'Matters related to my professions.',
    statistics: {
      total_bulbs: 0,
    },
  },
  {
    name: 'RandomStuffs',
    description: null,
    statistics: {
      total_bulbs: 0,
    },
  },
];

export const REFERENCE_SOURCE_RECORDS: Array<IReferenceSourceData> = [
  {
    name: 'The Republic',
    type: ReferenceSourceType.PRINT,
    locator: null,
    image_url: 'https://m.media-amazon.com/images/I/71Myavx503L._SY466_.jpg',
    description: 'Famous Work by Plato',
    statistics: {
      total_bulbs: 0,
    },
  },
  {
    name: 'Eine Kleine Nachtmusik',
    type: ReferenceSourceType.MUSIC,
    locator: null,
    image_url: null,
    description: 'Famous composition by Mozart',
    statistics: {
      total_bulbs: 0,
    },
  },
  {
    name: 'Spider-Man Official Trailer',
    type: ReferenceSourceType.VIDEO,
    locator: 'https://www.youtube.com/watch?v=t06RUxPbp_c',
    image_url: null,
    description: null,
    statistics: {
      total_bulbs: 0,
    },
  },
  {
    name: 'Smooth Criminal',
    type: ReferenceSourceType.MUSIC,
    locator: 'https://www.youtube.com/watch?v=h_D3VFfhvs4',
    image_url: null,
    description: 'Michael Jackson hit song',
    statistics: {
      total_bulbs: 0,
    },
  },
];

export const TAG_RECORDS: Array<ITagData> = [
  {
    label: 'Art',
    parent: null,
    description: 'Everything that is beautiful',
    statistics: {
      total_bulbs: 0,
      total_children: 0,
    },
  },
  {
    label: 'Classical Music',
    parent: null,
    description: null,
    statistics: {
      total_bulbs: 0,
      total_children: 1,
    },
  },
  {
    label: 'Good Read',
    parent: null,
    description: 'Every inspiring book',
    statistics: {
      total_bulbs: 0,
      total_children: 0,
    },
  },
  {
    label: 'Mozart',
    parent: {
      id: 'Classical Music',
    },
    description: null,
    statistics: {
      total_bulbs: 0,
      total_children: 0,
    },
  },
  {
    label: 'Good Movies',
    parent: null,
    description: null,
    statistics: {
      total_bulbs: 0,
      total_children: 0,
    },
  },
];

export const BULB_RECORDS: Array<IBulbData> = [
  {
    title: 'New book unlocked',
    category: {
      id: 'Hobbies',
    },
    content: `Just bought Plato's The Republic! Wondering how long will it take to finish it? I can't wait...`,
    references: [],
    tags: [],
    past_versions: [],
  },
  {
    title: 'Power and Responsibility',
    category: {
      id: 'Reflections',
    },
    content: `There is a line in Spider-Man movie, "with great power comes great responsibility", I have so much responsibilities now, does it mean I have a great power?`,
    references: [{ source: { id: 'Spider-Man Official Trailer' }, detail: null }],
    tags: [{ id: 'Good Movies' }],
    past_versions: [],
  },
  {
    title: 'If Mozart lives in today',
    category: {
      id: 'RandomStuffs',
    },
    content: `Drove my car while listening to radio, one channel plays Nachtmusik while another Smooth Criminal. What would Mozart have thought about MJ had he been living in our age?`,
    references: [
      { source: { id: 'Eine Kleine Nachtmusik' }, detail: null },
      { source: { id: 'Smooth Criminal' }, detail: null },
    ],
    tags: [{ id: 'Art' }, { id: 'Mozart' }],
    past_versions: [],
  },
];
