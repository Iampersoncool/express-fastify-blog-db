const form = document.querySelector('form');
const slug = form.dataset.slug;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const target = e.target;

  try {
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

    if (!response.ok) throw new Error(response.statusText);

    location.href = '/';
  } catch (e) {
    console.log(e);
    alert('An error occured editing the post.');
  }
});

function getValue(target, name) {
  return target.querySelector(name).value;
}
