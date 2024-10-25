// ** Vertical Menu Components
import VerticalNavMenuGroup from "./VerticalNavMenuGroup"
import VerticalNavMenuLink from "./VerticalNavMenuLink"
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader"

// ** Utils
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@layouts/utils"
import { useSelector } from "react-redux"

const VerticalMenuNavItems = (props) => {
  // ** Components Object
	const Components = {
		VerticalNavMenuLink,
		VerticalNavMenuGroup,
		VerticalNavMenuSectionHeader
	}
	const { userData } = props
    const loginAuth = useSelector((state) => state.loginAuth)

  // ** Render Nav Menu Items
	const RenderNavItems = props.items.map((item, index) => {
        if (loginAuth.menuList !== undefined) {
            const TagName = Components[resolveNavItemComponent(item)]
            if (item.children) {
                if (item.code) {
                    let available_read = false
                    loginAuth.menuList.map(auth => { if (item.code === auth.code) available_read = auth.available_read })
                    if (available_read) return (<TagName item={item} index={index} key={item.id} {...props} />)
                } else {
                    return <TagName item={item} index={index} key={item.id} {...props} />
                }
            } else {
                if (item.code) {
                    let available_read = false
                    loginAuth.menuList.map(auth => { if (item.code === auth.code) available_read = auth.available_read })
                    if (available_read) return (<TagName item={item} index={index} key={item.id} {...props} />)
                } else {
                    return <TagName key={item.id || item.header} item={item} userData={userData} {...props} />
                }
            }
        }
	})

	return RenderNavItems
}

export default VerticalMenuNavItems