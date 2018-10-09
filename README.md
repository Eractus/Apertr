# Apertr

[Live Demo](https://apertr.herokuapp.com/#/)

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/splash.png)

Apertr is created using a full stack consisting of the Rails/PostgreSQL and React/Redux backend and frontend technologies, respectively. It is basically built using the popular photo hosting site Flickr's UI and pages as wireframes to render the core features' components on the frontend using data it fetches via SQL-based API calls to the schema on the backend.

The project was initially built on an approximately 10 day timeline, where most of the core features (photos, albums, comments) and their models, controllers, and views were coded and rendering properly across the stack. Since then, more time has been invested to refactoring and re-styling these existing components as well as adding additional features in tags and a functional search bar. Future additions are planned to further build on its existing features.

## Features
<ul>
  <li>Users can sign up or log in via a frontend to backend user authentication that is secured through BCrypt.</li>
  <li>Users can upload photos which are stored securely via Amazon Web Services(AWS) S3.</li>
  <li>Users can access their photostream and albums on their own user profile page that also has customizable profile and cover photo.</li>
  <li>Users can view each photo on its own display page, where it contains the photo's information as well as a comments and tags section. If the current user is the photo's owner, he/she can also update or delete the photo as well as any associated comments or tags.</li>
  <li>Users can create, update, and delete albums with their uploaded photos.</li>
  <li>Users that are logged in can post/edit/delete their own comments or add tag words on any photo's display page.
  <li>Users can search for photos by looking up tag words.
</ul>

#### Structured Feed

After logging in, the feed page shows a list of photos from all users in a polaroid-like format and each contains some information about the photo, including the author's name that is also a link redirecting to that user's profile page where you can view his/her photostream and albums. The feed container is responsive and will show different columns of photos depending on the width of viewport. Currently, there are some awkward vertical spaces between photos in each column; this will be addressed in the future with CSS grid.

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/feed.png)

#### Easy Photo Uploading

Users can click the cloud upload icon on navbar to upload photos to their photostream. The process is as simple as selecting the file, adding a title and description, and hitting upload. Currently, users can only upload one photo at a time; this will be addressed in the future, possibly with a drag and drop feature.

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/photo-upload.png)

#### Personalized User Profile Page

Users have their own unique profile pages, where they can find a photostream tab of their uploaded photos as well as an albums tab of their created albums (and the link to create an album).

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/user-profile-photos.png)

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/user-profile-albums.png)

#### Photo Show Page with Plenty of Features

Each photo's own display page has its own comments and tags components that allow all users to interact with and contribute to the photo. If you're the photo's owner, you'll have additional functionalities to update or delete the photo, comments, and tags.

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/photo-show.png)

When users add a Tag word, they will only always create a new row entry in the PhotoTag joins table in the database. The Tags controller checks first if the Tag object for the word already exists to ensure no duplicates are created. And when a Tag word is removed from a Photo's show page, similarly only the PhotoTag row related to the Photo object and the Tag word object is destroyed, not the Tag word itself, to ensure other Photo's and PhotoTag's connected to the Tag word is not unintentionally removed as well.

```
  def create
    @tag = Tag.find_by(word: params[:tag][:word])
    if @tag == nil
      @tag = Tag.new(tag_params)
    end
    if !@tag.save
      render json: ['Enter a tag word.'], status: 422
    else
      photo_id = params[:photo_id]
      PhotoTag.create(photo_id: photo_id, tag_id: @tag.id)
      render :show
    end
  end

  def destroy
    @tag = Tag.find(params[:id])
    photo_id = params[:photoId]
    photo_tag = PhotoTag.find_by(tag_id: @tag.id, photo_id: photo_id)
    photo_tag.destroy
    render :show
  end
```

#### Responsive Adding/Removing Photos during Album Create or Update

On the album create and update components, you can create or update an album using photos from your photostream. You can add and remove photos instantly with a simple click on the photostream's photos or the uploaded photos already added to the state's photos array, which is achieved through ajax calls on the photos within the component.

![alt text](https://github.com/Eractus/Apertr/blob/master/app/assets/images/album-update.png)

The algorithm for the addPhoto function checks if the current state's photos array already contains the photo the user is trying to add. Once a duplicate is found, the function immediately updates the determinant variable and returns out of the loop to prevent unnecessary checks being performed.

```
  addPhoto(photo) {
    return () => {
      let currentPhotos = this.state.photos.slice();
      let foundDup = false;
      currentPhotos.forEach(pho => {
        if (pho.id === photo.id) {
          foundDup = true;
          return;
        }
      })
      if (!foundDup) {
        currentPhotos.push(photo);
        this.setState({
          photos: currentPhotos
        });
      }
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

#### Search Bar Allows Users to Search for Photos by Tag Words

Users can utilize the search bar on the right side of the navbar to search for photos based on tag words. Some example tag words are provided. Currently, the search bar only queries for photos and is only based on tag words.

![Live Demo](https://github.com/Eractus/Apertr/blob/master/app/assets/images/search.gif)

## Project Design

Apertr was initially designed with a primary focus on functionality, while cloning as much of Flickr's style as possible being secondary. With a window of less than two weeks, the core functions of photos and albums were prioritized so that future developments around said functions have the solid foundation needed to achieve said developments.

Since revisiting, much of the development has been polishing styling of the already functional components and refactoring for efficiency and DRY-ness.

## Technologies

In terms of backend, Rails was the most viable backend with its RESTful architecture as well as many available default support and features. The relatively small scope of the project meant that the ease of use of Rails's structure would be sufficient while fitting the bill for the project's timeline.

React and Redux are used for the front end because of the ability to maintain a normalized state, which lends to an easier time in keeping things in check as it relates to the database with each component's slice of states' own actions and reducers.

Finally, Heroku was used to host production for similar reasons as Rails in terms of out-of-the-box support and features. Additionally, as mentioned AWS S3 was used for image uploading.

## Possible future features

<ul>
  <li>Drag and drop, multi-upload for photos</li>
  <li>Faves</li>
  <li>Broader search bar</li>
</ul>
