# Apertr

[Live Demo](https://apertr.herokuapp.com/#/)

Created using a combination of Rails/PostgreSQL on the backend and React/Redux on the frontend, Apertr is intended to be a clone of the popular photo hosting site Flickr.

The project was built on an approximately 10 day timeline. Future additions/improvements are planned to further build on its existing features.

## Features
<ul>
  <li>A frontend to backend user authentication secured through BCrypt.</li>
  <li>Users can upload photos which are stored securely through Amazon Web Services(AWS) S3.</li>
  <li>Users can create albums with their uploaded photos.</li>
</ul>

### Structured Feed and Photo Stream

After logging in, the splash page shows a list of photos from all users in a polaroid-like structure, including the photo's author and title, while the photo stream has your uploaded images structured in a clean/concise manner. While the images are not structured perfectly horizontally (something to be addressed in the future with CSS Masonry), they are oriented to be aligned vertically, consistently as you scroll down.

Logged-in splash:

![alt text](https://imgur.com/TycScb4.png)

Photostream:

![alt text](https://imgur.com/Sy10afa.png)

#### Responsive Adding/Removing Photos during Album Create

While logged in and after uploading photos, you can create an album with said photos. The feature allows you to add and remove photos from your available options instantly with a simple click, which this is achieved through ajax calls on the photos within the component.

```
    addPhoto(photo) {
    return (e) => {
      let dupPhotos = this.state.photos.slice();
      if (!dupPhotos.includes(photo)) {
        dupPhotos.push(photo);
      }
      this.setState({
        photos: dupPhotos
      });
    };
  }

  removePhoto(photo) {
    return (e) => {
      this.setState({
        photos: this.state.photos.filter(pho => pho.id !== photo.id)
      })
    };
  }
```

## Project Design

Apertr was designed with a primary focus on functionality, while cloning as much of Flickr's style as possible being secondary. With a window of less than two weeks, the core functions of photos and albums were prioritized so that future developments around said functions have the solid foundation needed to achieve said developments.

## Technologies

In terms of backend, Rails was the most viable backend with its RESTful architecture as well as many available default support and features. The relatively small scope of the project meant that the ease of use of Rails's structure would be sufficient while fitting the bill for the project's timeline.

React and Redux are used for the front end because of the ability to maintain a normalized state, which lends to an easier time in keeping things in check as it relates to the database with each component's slice of states' own actions and reducers.

Finally, Heroku was used to host production for similar reasons as Rails in terms of out-of-the-box support and features. Additionally, as mentioned AWS S3 was used for image uploading.

## Possible future features

<ul>
  <li>Comments.</li>
  <li>Photo Taggings</li>
  <li>User profiles</li>
</ul>
