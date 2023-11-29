import { SidebarLink } from '@/types'

export const themes = [
  { value: 'light', label: 'روز', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'شب', icon: '/assets/icons/moon.svg' },
  { value: 'system', label: 'سیستم', icon: '/assets/icons/computer.svg' },
]
export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'خانه',
  },
  {
    imgURL: '/assets/icons/users.svg',
    route: '/community',
    label: 'کامیونیتی',
  },
  {
    imgURL: '/assets/icons/star.svg',
    route: '/collection',
    label: 'کلکسیون',
  },
  {
    imgURL: '/assets/icons/suitcase.svg',
    route: '/jobs',
    label: 'شغلها',
  },
  {
    imgURL: '/assets/icons/tag.svg',
    route: '/tags',
    label: 'تگها',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/profile',
    label: 'پروفایل',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/ask-question',
    label: 'سوال پرسیدن',
  },
]
export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
}

export const AnswerFilters = [
  { name: 'Highest Upvotes', value: 'highestUpvotes' },
  { name: 'Lowest Upvotes', value: 'lowestUpvotes' },
  { name: 'Most Recent', value: 'recent' },
  { name: 'Oldest', value: 'old' },
]
export const UserFilters = [
  { name: 'کاربر جدید', value: 'new_users' },
  {
    name: 'کاربر قدیمی',
    value: 'old_users',
  },
  {
    name: 'بیشترین مشارکت',
    value: 'top_contributors',
  },
]
export const QuestionFilters = [
  {
    name: 'Most Recent',
    value: 'most_recent',
  },
  {
    name: 'Oldest',
    value: 'oldest',
  },
  {
    name: 'Most Voted',
    value: 'most_voted',
  },
  {
    name: 'Most Viewed',
    value: 'most_viewed',
  },
  {
    name: 'Most Answered',
    value: 'most_answered',
  },
]
export const TagFilters = [
  {
    name: 'محبوب',
    value: 'popular',
  },
  {
    name: 'اخیر',
    value: 'recent',
  },
  {
    name: 'نام',
    value: 'name',
  },
  {
    name: 'قدیمی‌تر',
    value: 'old',
  },
]
export const HomePageFilters = [
  {
    name: 'جدیدترین',
    value: 'newest',
  },
  {
    name: 'پیشنهادی',
    value: 'recommended',
  },
  {
    name: 'پرتکرار',
    value: 'frequent',
  },
  {
    name: 'بدون جواب',
    value: 'unanswered',
  },
]
export const GlobalSearchFilters = [
  {
    name: 'Question',
    value: 'question',
  },
  {
    name: 'Answer',
    value: 'answer',
  },
  {
    name: 'User',
    value: 'user',
  },
  {
    name: 'Tag',
    value: 'tag',
  },
]
