const form = document.querySelector('form');
const slug = document.getElementById('slug').textContent;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const target = e.target;

  const response = await fetch(target.action, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      secretCode: getValue(target, '#pwd'),
      stuff: {
        slug,
        title: getValue(target, '#title'),
        date: getValue(target, '#date'),
        description: getValue(target, '#description'),
        rawMarkdown: getValue(target, '#markdown'),
      },
    }),
  });

  if (!response.ok) return console.log('error');

  location.href = '/';
});

function getValue(target, name) {
  return target.querySelector(name).value;
}
