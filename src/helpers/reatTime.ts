const readTime = (content: string) => {
  const contentFormat = content.replace(/<[^>]*>?/gm, "");
  const countContent = contentFormat.split(" ").length;

  const readingInMin = Math.round(countContent / 200 + 1);
  return `${readingInMin} min`;
};

export default readTime;
