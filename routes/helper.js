const imgData = require("../data/img");

function pagination(data, pageNum, showPerPage) {
  const pageCount = Math.ceil(data.length / showPerPage);
  let page = parseInt(pageNum);
  if (!page || page <= 0) { page = 1;}
  if (page > pageCount) {
    page = pageCount;
  }
  let isLastPage = false;
  if (pageCount == page) isLastPage = true;

  data = {
    data : data.slice(page * showPerPage - showPerPage, page * showPerPage),
    totalPage: pageCount,
    currentPage: page,
    showPerPage: showPerPage,
    isLastPage: isLastPage
  }

  return data;
}

async function getCertainPageOfPhotos(photos, pageNum, showPerPage) {
  let pagedData = pagination(photos, pageNum, showPerPage);
  photos = [];
  for(let photoId of pagedData.data){
    photos.push({id: photoId,
                photo: await imgData.getPhotoDataId(photoId)});
  }
  return {photos: photos, isLastPage: pagedData.isLastPage};
}

async function getFirstPageOfPhotos(photos) {
  let pagedData = pagination(photos, 1, 4);
  photos = [];
  for (let photoId of pagedData.data) {
    photos.push({ id : photoId,
                photo : await imgData.getPhotoDataId(photoId)});
  }
  return {photos: photos, 
          isLastPage: pagedData.isLastPage}; 
}

module.exports = {
  pagination,
  getCertainPageOfPhotos,
  getFirstPageOfPhotos
}
