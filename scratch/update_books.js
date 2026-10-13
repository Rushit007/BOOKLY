const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('frontend/src/data/mockBooks.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const lines = content.split('\n');
const newLines = [];
let curId = '';
let curIsbn = '';
let curRating = 4.5;
let curReviews = 100;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/id:\s*'([^']+)'/);
  if (idMatch) curId = idMatch[1];
  const isbnMatch = line.match(/isbn:\s*'([^']+)'/);
  if (isbnMatch) curIsbn = isbnMatch[1];
  const ratingMatch = line.match(/rating:\s*([0-9.]+)/);
  if (ratingMatch) curRating = parseFloat(ratingMatch[1]);
  const revMatch = line.match(/numReviews:\s*([0-9]+)/);
  if (revMatch) curReviews = parseInt(revMatch[1]);

  if (line.includes('coverImage:')) {
    newLines.push(`    coverImage: VERIFIED_BOOK_COVERS['${curId}'] || 'https://covers.openlibrary.org/b/isbn/${curIsbn}-L.jpg',`);
  } else if (line.includes('createdAt:') && !lines[i+1]?.includes('tierRating:')) {
    const tier = curRating >= 4.8 ? 'perfection' : curRating >= 4.5 ? 'go_for_it' : curRating >= 4.0 ? 'timepass' : 'skip';
    const perfVotes = Math.round(curReviews * (curRating >= 4.8 ? 0.84 : curRating >= 4.5 ? 0.28 : 0.10));
    const goVotes = Math.round(curReviews * (curRating >= 4.8 ? 0.13 : curRating >= 4.5 ? 0.62 : 0.25));
    const passVotes = Math.max(1, Math.round(curReviews * (curRating >= 4.8 ? 0.02 : curRating >= 4.5 ? 0.08 : 0.52)));
    const skipVotes = Math.max(1, Math.round(curReviews * (curRating >= 4.8 ? 0.01 : curRating >= 4.5 ? 0.02 : 0.13)));
    newLines.push(line);
    newLines.push(`    tierRating: '${tier}',`);
    newLines.push(`    tierVotes: { perfection: ${perfVotes}, go_for_it: ${goVotes}, timepass: ${passVotes}, skip: ${skipVotes} },`);
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync(targetPath, newLines.join('\n'));
console.log('Successfully updated mockBooks.ts!');
