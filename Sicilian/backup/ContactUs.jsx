export const ContactUs = () => {
  return (
    <div>
      <h1>Kontakta oss</h1>
      <p>Vi finns att kontakta via telefon: 123-456-789</p>
      <p>Vi finns att kontakta via e-post: TheSicilianSquad@gmail.com</p>
      <p>Vi finns att kontakta via sociala medier:</p>
      <p>Instagram: @siciliansquad</p>
      <p>Facebook: @siciliansquad</p>
      <p>Twitter: @siciliansquad</p>
      <p>Vi finns att kontakta via kontaktformulär:</p>
      <form>
        <input type="text" placeholder="Namn" />
        <input type="email" placeholder="E-post" />
        <textarea placeholder="Meddelande"></textarea>
        <button type="submit">Skicka</button>
      </form>
    </div>
  );
};
