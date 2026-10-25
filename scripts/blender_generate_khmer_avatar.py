"""
Blender 5.x Python Script: Generate Traditional Khmer Outfit Player Avatar
Follows reference design:
- Khmer Woven Straw Hat (មួកស្លឹកខ្មែរ) with Cambodian Flag (ទង់ជាតិកម្ពុជា) & chin strap
- Traditional Linen Shirt (អាវកត្រង់ដៃវែងបត់) in cream/beige with rolled-up sleeves
- Red & White Checkered Krama Sash (ក្រមាខ្មែរក្រវាត់ចង្កេះ) with hip knot and hanging fringe
- Rich Chocolate Brown Chong Kben Pants (ខោរបៀបចងក្បិន)
- High Knee-Length Weathered Leather Boots (ស្បែកជើងកវែងស្បែក)
- Humanoid Armature with rigged vertex groups and animations: Idle, Walk, Run, Jump, Wave, Bow (Sampeah)
"""

import bpy
import math
import os
import numpy as np

def clean_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_textured_material(name, img_array, roughness=0.6, metallic=0.0):
    mat = bpy.data.materials.new(name=name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    
    h, w, _ = img_array.shape
    img = bpy.data.images.new(name=f"{name}_Tex", width=w, height=h, alpha=True)
    img.pixels.foreach_set(img_array.flatten())
    img.pack()
    
    tex_node = nodes.new("ShaderNodeTexImage")
    tex_node.image = img
    links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    return mat

# --- TEXTURE GENERATORS ---
def gen_flag_texture(w=512, h=320):
    img = np.zeros((h, w, 4), dtype=np.float32)
    blue = np.array([0.012, 0.180, 0.651, 1.0], dtype=np.float32)
    red = np.array([0.878, 0.000, 0.145, 1.0], dtype=np.float32)
    white = np.array([1.0, 1.0, 1.0, 1.0], dtype=np.float32)
    
    h1 = int(h * 0.25)
    h2 = int(h * 0.75)
    # Bottom blue (V=0..0.25), Center red (V=0.25..0.75), Top blue (V=0.75..1.0)
    img[:h1, :] = blue
    img[h1:h2, :] = red
    img[h2:, :] = blue
    
    cx, cy = w // 2, h // 2
    # Base platform
    bw, bh = int(w * 0.32), int(h * 0.05)
    img[cy - int(h*0.12) : cy - int(h*0.12) + bh, cx - bw//2 : cx + bw//2] = white
    # Second tier
    t2w, t2h = int(w * 0.25), int(h * 0.04)
    img[cy - int(h*0.12) + bh : cy - int(h*0.12) + bh + t2h, cx - t2w//2 : cx + t2w//2] = white
    
    # Towers pointing up (+V direction)
    base_top = cy - int(h*0.12) + bh + t2h
    # Center tower
    cw, ch = int(w * 0.05), int(h * 0.18)
    img[base_top : base_top + ch, cx - cw//2 : cx + cw//2] = white
    for dy in range(int(h * 0.06)):
        sw = int((cw // 2) * (1 - dy / (h * 0.06)))
        if sw > 0 and base_top + ch + dy < h2:
            img[base_top + ch + dy, cx - sw : cx + sw] = white
            
    # Flanking towers
    for off in [-int(w * 0.085), int(w * 0.085)]:
        tx, tw, th = cx + off, int(w * 0.038), int(h * 0.13)
        img[base_top : base_top + th, tx - tw//2 : tx + tw//2] = white
        for dy in range(int(h * 0.045)):
            sw = int((tw // 2) * (1 - dy / (h * 0.045)))
            if sw > 0 and base_top + th + dy < h2:
                img[base_top + th + dy, tx - sw : tx + sw] = white
    return img

def gen_krama_texture(size=512):
    img = np.zeros((size, size, 4), dtype=np.float32)
    dark_red = np.array([0.55, 0.08, 0.12, 1.0], dtype=np.float32)
    med_red  = np.array([0.78, 0.32, 0.36, 1.0], dtype=np.float32)
    white    = np.array([0.96, 0.93, 0.89, 1.0], dtype=np.float32)
    cell = size // 16
    for y in range(size):
        r = ((y // cell) % 2) == 0
        for x in range(size):
            c = ((x // cell) % 2) == 0
            val = dark_red if (r and c) else (med_red if (r or c) else white)
            noise = ((x + y) % 3) * 0.02 - 0.01
            img[y, x] = np.clip(val + np.array([noise, noise, noise, 0.0]), 0.0, 1.0)
    return img

def gen_straw_texture(size=512):
    img = np.zeros((size, size, 4), dtype=np.float32)
    base = np.array([0.83, 0.70, 0.48, 1.0], dtype=np.float32)
    light = np.array([0.92, 0.81, 0.60, 1.0], dtype=np.float32)
    dark  = np.array([0.65, 0.52, 0.33, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            slat = ((x // 8) % 2) ^ ((y // 16) % 2)
            c = light if slat else dark
            img[y, x] = c * 0.35 + base * 0.65
    return img

def gen_linen_texture(size=256):
    img = np.zeros((size, size, 4), dtype=np.float32)
    base = np.array([0.87, 0.82, 0.72, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            weave = (((x % 4 == 0) + (y % 4 == 0)) * 0.02)
            noise = (((x * 19 + y * 23) % 7) / 7.0) * 0.015
            img[y, x] = np.clip(base - weave + noise, 0.0, 1.0)
    return img

def gen_chongkben_texture(size=256):
    img = np.zeros((size, size, 4), dtype=np.float32)
    base = np.array([0.28, 0.17, 0.10, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            crease = math.sin(x * 0.1) * 0.02
            img[y, x] = np.clip(base + crease, 0.0, 1.0)
    return img

def gen_boots_texture(size=256):
    img = np.zeros((size, size, 4), dtype=np.float32)
    base = np.array([0.14, 0.08, 0.05, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            grain = (((x * 31 + y * 37) % 11) / 11.0) * 0.02
            img[y, x] = np.clip(base + grain, 0.0, 1.0)
    return img

def gen_skin_texture(size=512):
    img = np.zeros((size, size, 4), dtype=np.float32)
    skin = np.array([0.76, 0.55, 0.40, 1.0], dtype=np.float32)
    img[:, :] = skin
    # Eyebrows
    brow = np.array([0.12, 0.09, 0.08, 1.0], dtype=np.float32)
    img[275:287, 160:225] = brow
    img[275:287, 287:352] = brow
    # Eyes
    white = np.array([0.96, 0.96, 0.96, 1.0], dtype=np.float32)
    dark_eye = np.array([0.12, 0.08, 0.06, 1.0], dtype=np.float32)
    img[250:270, 172:218] = white
    img[252:268, 187:207] = dark_eye
    img[250:270, 294:340] = white
    img[252:268, 305:325] = dark_eye
    # Natural lips
    lips = np.array([0.64, 0.36, 0.30, 1.0], dtype=np.float32)
    img[180:198, 225:287] = lips
    return img

def build_khmer_avatar(output_glb, preview_path=None):
    clean_scene()
    print("Building Khmer Avatar 3D Model with PBR Textures...")

    # Materials with textures
    mat_flag = create_textured_material("Mat_Flag", gen_flag_texture(), roughness=0.4)
    mat_krama = create_textured_material("Mat_Krama", gen_krama_texture(), roughness=0.85)
    mat_straw = create_textured_material("Mat_Straw", gen_straw_texture(), roughness=0.7)
    mat_linen = create_textured_material("Mat_LinenShirt", gen_linen_texture(), roughness=0.75)
    mat_chongkben = create_textured_material("Mat_ChongKben", gen_chongkben_texture(), roughness=0.85)
    mat_boots = create_textured_material("Mat_Boots", gen_boots_texture(), roughness=0.35, metallic=0.1)
    mat_skin = create_textured_material("Mat_Skin", gen_skin_texture(), roughness=0.5)
    mat_hair = create_textured_material("Mat_Hair", np.full((64, 64, 4), [0.08, 0.06, 0.05, 1.0], dtype=np.float32), roughness=0.9)
    mat_cord = create_textured_material("Mat_HatCord", np.full((64, 64, 4), [0.85, 0.75, 0.55, 1.0], dtype=np.float32), roughness=0.8)

    mesh_objects = []

    # 1. HEAD & FACE
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.115, location=(0, 0, 1.63))
    head = bpy.context.active_object
    head.scale = (0.9, 1.0, 1.1)
    head.name = "Head"
    head.data.materials.append(mat_skin)
    mesh_objects.append(head)

    # Hair under hat
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0, -0.015, 1.66))
    hair = bpy.context.active_object
    hair.scale = (0.92, 1.02, 0.95)
    hair.name = "Hair"
    hair.data.materials.append(mat_hair)
    mesh_objects.append(hair)

    # Ears
    for side, sx in [("L", -0.108), ("R", 0.108)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.012, location=(sx, -0.01, 1.63), rotation=(0, math.pi/2, 0))
        ear = bpy.context.active_object
        ear.name = f"Ear_{side}"
        ear.data.materials.append(mat_skin)
        mesh_objects.append(ear)

    # Neck
    bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=0.12, location=(0, 0, 1.50))
    neck = bpy.context.active_object
    neck.name = "Neck"
    neck.data.materials.append(mat_skin)
    mesh_objects.append(neck)

    # 2. KHMER STRAW HAT & CAMBODIAN FLAG
    # Hat Brim (sloping cone) sits naturally on head brow
    bpy.ops.mesh.primitive_cone_add(radius1=0.42, radius2=0.165, depth=0.08, location=(0, 0, 1.68))
    hat_brim = bpy.context.active_object
    hat_brim.name = "Hat_Brim"
    hat_brim.data.materials.append(mat_straw)
    mesh_objects.append(hat_brim)

    # Hat Crown (cylinder with flat top)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.165, depth=0.14, location=(0, 0, 1.77))
    hat_crown = bpy.context.active_object
    hat_crown.name = "Hat_Crown"
    hat_crown.data.materials.append(mat_straw)
    mesh_objects.append(hat_crown)

    # Hat Crown Band / Trim
    bpy.ops.mesh.primitive_torus_add(major_radius=0.168, minor_radius=0.012, location=(0, 0, 1.71))
    hat_band = bpy.context.active_object
    hat_band.name = "Hat_Band"
    hat_band.data.materials.append(mat_straw)
    mesh_objects.append(hat_band)

    # Cambodian Flag Badge on FRONT of Crown (+Y is front)
    # Modeled with Z-up, X-horizontal, upright flag
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.167, 1.78), rotation=(0, 0, 0))
    flag_mesh = bpy.context.active_object
    flag_mesh.scale = (0.12, 0.005, 0.075)
    flag_mesh.name = "Hat_Cambodian_Flag"
    flag_mesh.data.materials.append(mat_flag)
    mesh_objects.append(flag_mesh)

    # Hat Chin Cord & Knot
    bpy.ops.mesh.primitive_torus_add(major_radius=0.105, minor_radius=0.007, location=(0, 0.02, 1.54), rotation=(math.radians(25), 0, 0))
    chin_cord = bpy.context.active_object
    chin_cord.scale = (0.75, 1.0, 1.2)
    chin_cord.name = "Hat_ChinCord"
    chin_cord.data.materials.append(mat_cord)
    mesh_objects.append(chin_cord)

    # Knot bead under chin
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.014, location=(0, 0.065, 1.47))
    knot_bead = bpy.context.active_object
    knot_bead.name = "Hat_KnotBead"
    knot_bead.data.materials.append(mat_cord)
    mesh_objects.append(knot_bead)

    # 3. LINEN SHIRT (អាវ)
    # Mandarin Collar
    bpy.ops.mesh.primitive_cylinder_add(radius=0.062, depth=0.04, location=(0, 0, 1.46))
    collar = bpy.context.active_object
    collar.name = "Shirt_Collar"
    collar.data.materials.append(mat_linen)
    mesh_objects.append(collar)

    # Upper Chest (Broader shoulders)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.19, depth=0.22, location=(0, 0, 1.34))
    upper_torso = bpy.context.active_object
    upper_torso.scale = (1.05, 0.65, 1.0)
    upper_torso.name = "Shirt_UpperTorso"
    upper_torso.data.materials.append(mat_linen)
    mesh_objects.append(upper_torso)

    # Lower Torso (Tapered waist)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.17, depth=0.22, location=(0, 0, 1.15))
    lower_torso = bpy.context.active_object
    lower_torso.scale = (1.0, 0.62, 1.0)
    lower_torso.name = "Shirt_LowerTorso"
    lower_torso.data.materials.append(mat_linen)
    mesh_objects.append(lower_torso)

    # Chest button placket (+Y front)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.125, 1.32))
    placket = bpy.context.active_object
    placket.scale = (0.035, 0.01, 0.22)
    placket.name = "Shirt_Placket"
    placket.data.materials.append(mat_linen)
    mesh_objects.append(placket)

    # Left Chest Pocket
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.09, 0.125, 1.30))
    pocket = bpy.context.active_object
    pocket.scale = (0.06, 0.008, 0.07)
    pocket.name = "Shirt_Pocket"
    pocket.data.materials.append(mat_linen)
    mesh_objects.append(pocket)

    # Upper Arms with Rolled-up Sleeves
    for side, sx in [("L", -0.23), ("R", 0.23)]:
        # Upper arm sleeve (linen)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.24, location=(sx, 0, 1.25))
        sleeve = bpy.context.active_object
        sleeve.name = f"Sleeve_{side}"
        sleeve.data.materials.append(mat_linen)
        mesh_objects.append(sleeve)

        # Rolled sleeve cuff ring
        bpy.ops.mesh.primitive_torus_add(major_radius=0.068, minor_radius=0.016, location=(sx, 0, 1.13))
        cuff = bpy.context.active_object
        cuff.name = f"SleeveCuff_{side}"
        cuff.data.materials.append(mat_linen)
        mesh_objects.append(cuff)

        # Forearm (exposed skin)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.24, location=(sx, 0, 0.98))
        forearm = bpy.context.active_object
        forearm.name = f"Forearm_{side}"
        forearm.data.materials.append(mat_skin)
        mesh_objects.append(forearm)

        # Hand
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, 0, 0.81))
        hand = bpy.context.active_object
        hand.scale = (0.045, 0.07, 0.09)
        hand.name = f"Hand_{side}"
        hand.data.materials.append(mat_skin)
        mesh_objects.append(hand)

    # 4. KRAMA SASH BELT & HIP KNOT (ក្រមា)
    # Waist sash wrap
    bpy.ops.mesh.primitive_cylinder_add(radius=0.21, depth=0.12, location=(0, 0, 1.02))
    krama_belt = bpy.context.active_object
    krama_belt.scale = (1.0, 0.68, 1.0)
    krama_belt.name = "Krama_Belt"
    krama_belt.data.materials.append(mat_krama)
    mesh_objects.append(krama_belt)

    # Krama knot on left hip (+Y front, -X left)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.052, location=(-0.20, 0.08, 1.02))
    knot = bpy.context.active_object
    knot.scale = (1.2, 0.85, 1.0)
    knot.name = "Krama_Knot"
    knot.data.materials.append(mat_krama)
    mesh_objects.append(knot)

    # Hanging Krama sash tail over left thigh
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.20, 0.10, 0.80))
    krama_tail = bpy.context.active_object
    krama_tail.scale = (0.11, 0.02, 0.38)
    krama_tail.name = "Krama_Tail"
    krama_tail.data.materials.append(mat_krama)
    mesh_objects.append(krama_tail)

    # 5. CHONG KBEN PANTS (ខោរបៀបចងក្បិន)
    # Hips / Pelvis volume
    bpy.ops.mesh.primitive_cylinder_add(radius=0.20, depth=0.18, location=(0, 0, 0.90))
    pelvis = bpy.context.active_object
    pelvis.scale = (1.0, 0.70, 1.0)
    pelvis.name = "ChongKben_Pelvis"
    pelvis.data.materials.append(mat_chongkben)
    mesh_objects.append(pelvis)

    # Puffy legs (tucked at knees)
    for side, sx in [("L", -0.13), ("R", 0.13)]:
        # Puffy thigh
        bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=0.34, location=(sx, 0, 0.68))
        thigh = bpy.context.active_object
        thigh.scale = (1.0, 1.08, 1.0)
        thigh.name = f"ChongKben_Thigh_{side}"
        thigh.data.materials.append(mat_chongkben)
        mesh_objects.append(thigh)

        # Knee tuck cuff
        bpy.ops.mesh.primitive_cylinder_add(radius=0.095, depth=0.08, location=(sx, 0, 0.50))
        knee_tuck = bpy.context.active_object
        knee_tuck.name = f"ChongKben_Knee_{side}"
        knee_tuck.data.materials.append(mat_chongkben)
        mesh_objects.append(knee_tuck)

    # 6. HIGH LEATHER BOOTS (ស្បែកជើងកវែង)
    for side, sx in [("L", -0.13), ("R", 0.13)]:
        # Boot shaft (knee high)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.36, location=(sx, 0, 0.28))
        boot_shaft = bpy.context.active_object
        boot_shaft.name = f"Boot_Shaft_{side}"
        boot_shaft.data.materials.append(mat_boots)
        mesh_objects.append(boot_shaft)

        # Boot foot & toe (+Y front)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, 0.05, 0.05))
        boot_foot = bpy.context.active_object
        boot_foot.scale = (0.11, 0.24, 0.10)
        boot_foot.name = f"Boot_Foot_{side}"
        boot_foot.data.materials.append(mat_boots)
        mesh_objects.append(boot_foot)

    # Join all meshes into a single Character Mesh
    bpy.ops.object.select_all(action='DESELECT')
    for obj in mesh_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objects[0]
    bpy.ops.object.join()
    char_mesh = bpy.context.active_object
    char_mesh.name = "KhmerAvatarMesh"

    # Auto smooth normals
    for poly in char_mesh.data.polygons:
        poly.use_smooth = True

    # 7. ARMATURE RIGGING WITH STANDARD BONES
    bpy.ops.object.select_all(action='DESELECT')
    arm_data = bpy.data.armatures.new("KhmerRigData")
    arm_obj = bpy.data.objects.new("KhmerRig", arm_data)
    bpy.context.scene.collection.objects.link(arm_obj)
    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.mode_set(mode='EDIT')

    def add_bone(name, head, tail, parent_name=None):
        b = arm_data.edit_bones.new(name)
        b.head = head
        b.tail = tail
        if parent_name and parent_name in arm_data.edit_bones:
            b.parent = arm_data.edit_bones[parent_name]
        return b

    # Spine chain
    add_bone("Root", (0, 0, 0), (0, 0, 0.2))
    add_bone("Hips", (0, 0, 0.95), (0, 0, 1.15), "Root")
    add_bone("Chest", (0, 0, 1.15), (0, 0, 1.45), "Hips")
    add_bone("Neck", (0, 0, 1.45), (0, 0, 1.55), "Chest")
    add_bone("Head", (0, 0, 1.55), (0, 0, 1.95), "Neck")

    # Legs
    for side, sx in [("L", -0.13), ("R", 0.13)]:
        add_bone(f"UpperLeg_{side}", (sx, 0, 0.95), (sx, 0, 0.50), "Hips")
        add_bone(f"LowerLeg_{side}", (sx, 0, 0.50), (sx, 0, 0.12), f"UpperLeg_{side}")
        add_bone(f"Foot_{side}", (sx, 0, 0.12), (sx, 0.15, 0.02), f"LowerLeg_{side}")

    # Arms
    for side, sx in [("L", -0.18), ("R", 0.18)]:
        sign = -1 if side == "L" else 1
        add_bone(f"UpperArm_{side}", (sx, 0, 1.38), (sx + sign*0.05, 0, 1.13), "Chest")
        add_bone(f"Forearm_{side}", (sx + sign*0.05, 0, 1.13), (sx + sign*0.05, 0, 0.88), f"UpperArm_{side}")
        add_bone(f"Hand_{side}", (sx + sign*0.05, 0, 0.88), (sx + sign*0.05, 0, 0.74), f"Forearm_{side}")

    bpy.ops.object.mode_set(mode='OBJECT')

    # Parent mesh to armature with automatic vertex weight groups
    char_mesh.select_set(True)
    arm_obj.select_set(True)
    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')

    # 8. ANIMATIONS (Idle, Walk, Run, Wave, Bow)
    arm_obj.animation_data_create()

    def create_action(name, keyframes_func, frame_count):
        act = bpy.data.actions.new(name=name)
        arm_obj.animation_data.action = act
        keyframes_func(act, frame_count)
        track = arm_obj.animation_data.nla_tracks.new()
        track.name = name
        track.strips.new(name, 1, act)
        return act

    # Idle Action
    def anim_idle(act, length=60):
        for f, z_off in [(1, 0.0), (30, 0.02), (60, 0.0)]:
            pb = arm_obj.pose.bones['Chest']
            pb.location = (0, 0, z_off)
            pb.keyframe_insert('location', frame=f)
            pb.rotation_euler = (math.radians(1.5 * z_off * 50), 0, 0)
            pb.keyframe_insert('rotation_euler', frame=f)
    create_action("Idle", anim_idle, 60)

    # Walk Action
    def anim_walk(act, length=30):
        half = length // 2
        for f, l_leg, r_leg, l_arm, r_arm, z_bob in [
            (1,            (15, 0, 0),  (-15, 0, 0), (-20, 0, 0), (20, 0, 0),   0.0),
            (half // 2,    (0, 10, 0),  (0, 0, 0),   (0, 0, 0),   (0, 0, 0),    0.02),
            (half,         (-15, 0, 0), (15, 0, 0),  (20, 0, 0),  (-20, 0, 0),  0.0),
            (half + half // 2, (0, 0, 0), (0, 10, 0), (0, 0, 0),  (0, 0, 0),    0.02),
            (length,       (15, 0, 0),  (-15, 0, 0), (-20, 0, 0), (20, 0, 0),   0.0),
        ]:
            arm_obj.pose.bones['Hips'].location = (0, 0, z_bob)
            arm_obj.pose.bones['Hips'].keyframe_insert('location', frame=f)
            arm_obj.pose.bones['UpperLeg_L'].rotation_euler = [math.radians(x) for x in l_leg]
            arm_obj.pose.bones['UpperLeg_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperLeg_R'].rotation_euler = [math.radians(x) for x in r_leg]
            arm_obj.pose.bones['UpperLeg_R'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = [math.radians(x) for x in l_arm]
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = [math.radians(x) for x in r_arm]
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Walk", anim_walk, 30)

    # Run Action
    def anim_run(act, length=20):
        half = length // 2
        for f, l_leg, r_leg, l_arm, r_arm, z_bob in [
            (1,            (35, 0, 0),  (-30, 0, 0), (-45, 0, 0), (45, 0, 0),   0.0),
            (half // 2,    (0, 15, 0),  (0, 0, 0),   (0, 0, 0),   (0, 0, 0),    0.05),
            (half,         (-30, 0, 0), (35, 0, 0),  (45, 0, 0),  (-45, 0, 0),  0.0),
            (half + half // 2, (0, 0, 0), (0, 15, 0), (0, 0, 0),  (0, 0, 0),    0.05),
            (length,       (35, 0, 0),  (-30, 0, 0), (-45, 0, 0), (45, 0, 0),   0.0),
        ]:
            arm_obj.pose.bones['Chest'].rotation_euler = (math.radians(12), 0, 0)
            arm_obj.pose.bones['Chest'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['Hips'].location = (0, 0, z_bob)
            arm_obj.pose.bones['Hips'].keyframe_insert('location', frame=f)
            arm_obj.pose.bones['UpperLeg_L'].rotation_euler = [math.radians(x) for x in l_leg]
            arm_obj.pose.bones['UpperLeg_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperLeg_R'].rotation_euler = [math.radians(x) for x in r_leg]
            arm_obj.pose.bones['UpperLeg_R'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = [math.radians(x) for x in l_arm]
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = [math.radians(x) for x in r_arm]
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Run", anim_run, 20)

    # Wave Action
    def anim_wave(act, length=40):
        for f, rot_z in [(1, 0), (10, 25), (20, -15), (30, 25), (40, 0)]:
            pb = arm_obj.pose.bones['UpperArm_R']
            pb.rotation_euler = (math.radians(-110), 0, math.radians(rot_z))
            pb.keyframe_insert('rotation_euler', frame=f)
    create_action("Wave", anim_wave, 40)

    # Traditional Khmer Bow (Sampeah / សំពះ)
    def anim_bow(act, length=50):
        for f, bow_angle in [(1, 0), (25, 25), (50, 0)]:
            arm_obj.pose.bones['Chest'].rotation_euler = (math.radians(bow_angle), 0, 0)
            arm_obj.pose.bones['Chest'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['Head'].rotation_euler = (math.radians(bow_angle * 0.8), 0, 0)
            arm_obj.pose.bones['Head'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = (math.radians(-40), math.radians(20), math.radians(35))
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = (math.radians(-40), math.radians(-20), math.radians(-35))
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Bow", anim_bow, 50)

    arm_obj.animation_data.action = None

    # Reset poses to rest
    for pb in arm_obj.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_euler = (0, 0, 0)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)

    # Export to GLB
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        export_animations=True
    )
    print(f"✓ Khmer Player Avatar exported successfully to: {output_glb}")

    # Render Front and 3/4 Full Body Preview
    if preview_path:
        os.makedirs(os.path.dirname(preview_path), exist_ok=True)
        cam_data = bpy.data.cameras.new('PreviewCam')
        cam_obj = bpy.data.objects.new('PreviewCam', cam_data)
        bpy.context.scene.collection.objects.link(cam_obj)
        bpy.context.scene.camera = cam_obj
        # Looking from front-right at full body
        cam_obj.location = (0.8, 3.4, 1.05)
        cam_obj.rotation_euler = (math.radians(92), math.radians(0), math.radians(167))

        light_data = bpy.data.lights.new('Sun', type='SUN')
        light_obj = bpy.data.objects.new('Sun', light_data)
        bpy.context.scene.collection.objects.link(light_obj)
        light_obj.location = (2, 3, 4)
        light_data.energy = 4.0

        bpy.context.scene.render.engine = 'BLENDER_WORKBENCH'
        bpy.context.scene.display.shading.light = 'STUDIO'
        bpy.context.scene.display.shading.color_type = 'TEXTURE'
        bpy.context.scene.render.resolution_x = 768
        bpy.context.scene.render.resolution_y = 1024
        bpy.context.scene.render.filepath = preview_path
        bpy.ops.render.render(write_still=True)
        print(f"✓ Preview render saved to: {preview_path}")

if __name__ == "__main__":
    workspace = os.path.abspath(".")
    target_glb = os.path.join(workspace, "public", "models", "characters", "ItEngineer.glb")
    preview_img = os.path.abspath(r"C:\Users\Administrator\.gemini\antigravity-ide\brain\7a536326-32d3-4f22-8b7d-404ff1cabb67\scratch\khmer_avatar_preview.png")
    build_khmer_avatar(target_glb, preview_img)
