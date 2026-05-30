import {
  faUser,
  faCode,
  faBriefcase,
  faLayerGroup,
  faGraduationCap,
  faCertificate,
  faEnvelope,
  faServer,
} from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export interface NavItem {
  id: string
  label: string
  icon: IconDefinition
}

export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About", icon: faUser },
  { id: "projects", label: "Projects", icon: faCode },
  { id: "experience", label: "Experience", icon: faBriefcase },
  { id: "skills", label: "Skills", icon: faLayerGroup },
  { id: "education", label: "Education", icon: faGraduationCap },
  { id: "certificate", label: "Certificates", icon: faCertificate },
  { id: "contact", label: "Contact", icon: faEnvelope },
  { id: "server", label: "Server", icon: faServer },
]
