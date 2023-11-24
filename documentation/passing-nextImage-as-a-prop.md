# Image Type for passing 

- first we import _Image_ from _'public/...'_ folder
- then we pass it as a prop
- we accept ot in a child component as a _{ type ImageProps } from 'next/image'_
- after all we use it as a _image.src_ for src property.

```typescript

// Parent component
import SearchIcon from 'public/assets/icons/search.svg'

... 
<LocalSearchbar imgSrc={SearchIcon} />

// Child component
import Image, { type ImageProps } from 'next/image'

interface LocalSearchbarProps {
  imgSrc: ImageProps
 ...
}
...
 {iconPosition === 'left' && (
        <Image

          src={imgSrc.src}
          
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

```
