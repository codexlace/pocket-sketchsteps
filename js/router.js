export const routes = {
  home: 'home',
  lesson: 'lesson',
  palette: 'palette',
  bio: 'bio',
  generator: 'generator'
};

export function setHashRoute(route, id = '') {
  location.hash = id ? `${route}/${id}` : route;
}
