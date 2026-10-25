"""
Blender 5.2 Python Script: High-Fidelity Khmer Traditional Outfit Avatar Generator
Animations Included:
- Idle (ដកដង្ហើម និងយោលដៃធម្មជាតិ)
- Walk (ដើរ)
- Run (រត់)
- Jump (លោតឡើងលើ)
- Attack (វាយប្រហារ/ដាល់ទៅមុខ)
- Dash (ហក់/បោះខ្លួនទៅមុខ)
- Wave (លើកដៃបក់)
- Bow (សំពះប្រពៃណីខ្មែរ)
Rigging:
- 17-bone Standard Humanoid Armature with 100% explicit vertex groups (Zero weighting failures).
"""

import bpy
import bmesh
import math
import os
import numpy as np

def clean_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_pbr_material(name, img_array, roughness=0.6, metallic=0.0):
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

# ==========================================
# 1. TEXTURE GENERATORS
# ==========================================

def gen_flag_texture(w=1024, h=640):
    img = np.zeros((h, w, 4), dtype=np.float32)
    blue = np.array([0.015, 0.170, 0.650, 1.0], dtype=np.float32)
    red  = np.array([0.860, 0.020, 0.130, 1.0], dtype=np.float32)
    white = np.array([1.0, 1.0, 1.0, 1.0], dtype=np.float32)
    
    h_blue = int(h * 0.25)
    img[:h_blue, :] = blue
    img[h - h_blue:, :] = blue
    img[h_blue : h - h_blue, :] = red
    
    cx, cy = w // 2, h // 2
    b1_w, b1_h = int(w * 0.36), int(h * 0.045)
    img[cy - int(h*0.14) : cy - int(h*0.14) + b1_h, cx - b1_w//2 : cx + b1_w//2] = white
    b2_w, b2_h = int(w * 0.30), int(h * 0.038)
    base_top = cy - int(h*0.14) + b1_h
    img[base_top : base_top + b2_h, cx - b2_w//2 : cx + b2_w//2] = white
    
    wall_top = base_top + b2_h
    cw, ch = int(w * 0.06), int(h * 0.20)
    img[wall_top : wall_top + ch, cx - cw//2 : cx + cw//2] = white
    for dy in range(int(h * 0.08)):
        sw = int((cw // 2) * (1.0 - (dy / (h * 0.08))**0.8))
        if sw > 0 and wall_top + ch + dy < h - h_blue:
            img[wall_top + ch + dy, cx - sw : cx + sw] = white
            
    for off in [-int(w * 0.095), int(w * 0.095)]:
        tx, tw, th = cx + off, int(w * 0.046), int(h * 0.14)
        img[wall_top : wall_top + th, tx - tw//2 : tx + tw//2] = white
        for dy in range(int(h * 0.06)):
            sw = int((tw // 2) * (1.0 - (dy / (h * 0.06))**0.8))
            if sw > 0 and wall_top + th + dy < h - h_blue:
                img[wall_top + th + dy, tx - sw : tx + sw] = white
                
    for off in [-int(w * 0.14), int(w * 0.14)]:
        tx, tw, th = cx + off, int(w * 0.032), int(h * 0.08)
        img[wall_top : wall_top + th, tx - tw//2 : tx + tw//2] = white
        
    return img

def gen_krama_texture(size=1024):
    img = np.zeros((size, size, 4), dtype=np.float32)
    dark_red   = np.array([0.65, 0.06, 0.12, 1.0], dtype=np.float32)
    bright_red = np.array([0.88, 0.20, 0.25, 1.0], dtype=np.float32)
    white      = np.array([0.98, 0.98, 0.97, 1.0], dtype=np.float32)
    
    cell = size // 32
    for y in range(size):
        r_even = ((y // cell) % 2) == 0
        y_thread = math.sin(y * 0.5) * 0.02
        for x in range(size):
            c_even = ((x // cell) % 2) == 0
            x_thread = math.sin(x * 0.5) * 0.02
            
            if r_even and c_even:
                col = dark_red
            elif r_even or c_even:
                col = bright_red
            else:
                col = white
                
            weave = (x_thread + y_thread)
            img[y, x] = np.clip(col + np.array([weave, weave, weave, 0.0]), 0.0, 1.0)
            
    for i in range(0, size, cell * 8):
        img[i:i+3, :] = np.clip(img[i:i+3, :] * 0.4 + np.array([0.05, 0.08, 0.35, 0.0]), 0.0, 1.0)
        img[:, i:i+3] = np.clip(img[:, i:i+3] * 0.4 + np.array([0.05, 0.08, 0.35, 0.0]), 0.0, 1.0)
        
    return img

def gen_straw_texture(size=1024):
    img = np.zeros((size, size, 4), dtype=np.float32)
    base_straw  = np.array([0.88, 0.78, 0.58, 1.0], dtype=np.float32)
    light_straw = np.array([0.96, 0.88, 0.70, 1.0], dtype=np.float32)
    dark_straw  = np.array([0.72, 0.60, 0.42, 1.0], dtype=np.float32)
    
    cx, cy = size / 2.0, size / 2.0
    y_coords, x_coords = np.mgrid[0:size, 0:size]
    angles = np.arctan2(y_coords - cy, x_coords - cx)
    radii = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)
    
    slat_wave = np.sin(angles * 36.0)
    radial_rings = np.sin(radii * 0.15)
    
    for y in range(size):
        for x in range(size):
            sw = slat_wave[y, x]
            rr = radial_rings[y, x]
            val = sw * 0.20 + rr * 0.08
            c = (base_straw * (1.0 - val) + light_straw * val) if val > 0 else (base_straw * (1.0 + val) + dark_straw * (-val))
            noise = (((x * 17 + y * 31) % 11) / 11.0) * 0.02
            img[y, x] = np.clip(c + np.array([noise, noise, noise, 0.0]), 0.0, 1.0)
    return img

def gen_linen_texture(size=512):
    img = np.zeros((size, size, 4), dtype=np.float32)
    linen_sand = np.array([0.91, 0.87, 0.80, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            slub = ((x % 3 == 0) + (y % 3 == 0)) * 0.02
            noise = (((x * 19 + y * 23) % 13) / 13.0) * 0.015 - 0.007
            img[y, x] = np.clip(linen_sand - slub + noise, 0.0, 1.0)
    return img

def gen_chongkben_texture(size=512):
    img = np.zeros((size, size, 4), dtype=np.float32)
    warm_brown = np.array([0.36, 0.22, 0.14, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            crease = math.sin(x * 0.08) * 0.03
            noise = (((x * 29 + y * 37) % 17) / 17.0) * 0.015
            img[y, x] = np.clip(warm_brown + crease + noise, 0.0, 1.0)
    return img

def gen_boots_texture(size=512):
    img = np.zeros((size, size, 4), dtype=np.float32)
    leather = np.array([0.18, 0.11, 0.08, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            crease = math.sin(y * 0.12) * 0.02 if y < 200 else 0
            img[y, x] = np.clip(leather + crease, 0.0, 1.0)
    img[:30, :] = np.clip(leather * 0.7, 0.0, 1.0)
    return img

def gen_skin_face_texture(size=1024):
    img = np.zeros((size, size, 4), dtype=np.float32)
    skin_tone = np.array([0.89, 0.74, 0.59, 1.0], dtype=np.float32)
    img[:, :] = skin_tone
    
    fx = int(size * 0.75)  # 768
    fy = int(size * 0.50)  # 512
    
    for y in range(size):
        for x in range(size):
            dist = math.sqrt((x - fx)**2 + (y - fy)**2)
            if dist > 260:
                factor = min(0.18, (dist - 260) / 300.0 * 0.18)
                img[y, x, :3] -= factor
                
    brow_col = np.array([0.14, 0.10, 0.08, 1.0], dtype=np.float32)
    for dy in range(18):
        bw = int(75 * (1.0 - dy / 18.0 * 0.3))
        img[575 + dy, 716 - bw//2 : 716 + bw//2] = brow_col
        img[575 + dy, 820 - bw//2 : 820 + bw//2] = brow_col
        
    sclera = np.array([0.96, 0.96, 0.96, 1.0], dtype=np.float32)
    iris   = np.array([0.16, 0.10, 0.07, 1.0], dtype=np.float32)
    pupil  = np.array([0.03, 0.02, 0.02, 1.0], dtype=np.float32)
    sheen  = np.array([1.0, 1.0, 1.0, 1.0], dtype=np.float32)
    
    ey = 530
    for ex in [716, 820]:
        img[ey - 16 : ey + 16, ex - 36 : ex + 36] = sclera
        y_grid, x_grid = np.ogrid[ey - 16 : ey + 16, ex - 36 : ex + 36]
        mask_iris = ((x_grid - ex)**2 + (y_grid - ey)**2) <= 15**2
        img[ey - 16 : ey + 16, ex - 36 : ex + 36][mask_iris] = iris
        mask_pupil = ((x_grid - ex)**2 + (y_grid - ey)**2) <= 7**2
        img[ey - 16 : ey + 16, ex - 36 : ex + 36][mask_pupil] = pupil
        img[ey + 4 : ey + 8, ex + 3 : ex + 7] = sheen
        
    lip_col = np.array([0.72, 0.44, 0.38, 1.0], dtype=np.float32)
    for dy in range(22):
        lw = int(85 * math.sin(dy / 22.0 * math.pi))
        img[420 + dy, fx - lw//2 : fx + lw//2] = lip_col
        
    return img

# ==========================================
# 2. 3D PROCEDURAL MODEL GENERATION
# ==========================================

def build_khmer_avatar(output_glb, preview_path=None):
    clean_scene()
    print("-> Creating Rigged Animated Khmer Avatar...")

    mat_flag = create_pbr_material("Mat_Flag", gen_flag_texture(), roughness=0.35)
    mat_krama = create_pbr_material("Mat_Krama", gen_krama_texture(), roughness=0.85)
    mat_straw = create_pbr_material("Mat_Straw", gen_straw_texture(), roughness=0.7)
    mat_linen = create_pbr_material("Mat_LinenShirt", gen_linen_texture(), roughness=0.72)
    mat_chongkben = create_pbr_material("Mat_ChongKben", gen_chongkben_texture(), roughness=0.82)
    mat_boots = create_pbr_material("Mat_Boots", gen_boots_texture(), roughness=0.32, metallic=0.15)
    mat_skin = create_pbr_material("Mat_Skin", gen_skin_face_texture(), roughness=0.48)
    mat_hair = create_pbr_material("Mat_Hair", np.full((64, 64, 4), [0.08, 0.06, 0.05, 1.0], dtype=np.float32), roughness=0.85)
    mat_cord = create_pbr_material("Mat_HatCord", np.full((64, 64, 4), [0.86, 0.76, 0.58, 1.0], dtype=np.float32), roughness=0.75)

    mesh_objects = []

    # ------------------------------------------
    # A. HEAD & NOSE
    # ------------------------------------------
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=0.115, location=(0, 0, 1.62))
    head = bpy.context.active_object
    head.scale = (0.88, 1.02, 1.12)
    head.name = "Head"
    head.data.materials.append(mat_skin)
    mesh_objects.append(head)

    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.017, radius2=0.007, depth=0.040, location=(0, 0.116, 1.59), rotation=(math.radians(82), 0, 0))
    nose = bpy.context.active_object
    nose.name = "Nose"
    nose.data.materials.append(mat_skin)
    mesh_objects.append(nose)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.122, location=(0, -0.018, 1.64))
    hair = bpy.context.active_object
    hair.scale = (0.91, 1.02, 0.94)
    hair.name = "Hair"
    hair.data.materials.append(mat_hair)
    mesh_objects.append(hair)

    for side, sx in [("L", -0.105), ("R", 0.105)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.022, depth=0.010, location=(sx, -0.015, 1.60), rotation=(0, math.pi/2, 0))
        ear = bpy.context.active_object
        ear.scale = (1.0, 1.25, 0.8)
        ear.name = f"Ear_{side}"
        ear.data.materials.append(mat_skin)
        mesh_objects.append(ear)

    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.052, depth=0.12, location=(0, 0, 1.48))
    neck = bpy.context.active_object
    neck.name = "Neck"
    neck.data.materials.append(mat_skin)
    mesh_objects.append(neck)

    # ------------------------------------------
    # B. KHMER WOVEN STRAW HAT
    # ------------------------------------------
    hat_center_y = -0.02
    hat_tilt_deg = -8
    hat_tilt_rad = math.radians(hat_tilt_deg)
    
    bm_hat = bmesh.new()
    segments = 48
    r_inner, r_outer = 0.155, 0.40
    z_inner_base, z_outer_base = 1.70, 1.63
    
    v_inner = []
    v_outer = []
    for i in range(segments):
        th = (i / segments) * 2 * math.pi
        pleat_z = math.sin(i * 3) * 0.007
        xi, yi = r_inner * math.cos(th), r_inner * math.sin(th) + hat_center_y
        xo, yo = r_outer * math.cos(th), r_outer * math.sin(th) + hat_center_y
        
        y_rel = r_inner * math.sin(th)
        z_tilted_i = z_inner_base + y_rel * math.tan(-hat_tilt_rad)
        y_rel_o = r_outer * math.sin(th)
        z_tilted_o = z_outer_base + y_rel_o * math.tan(-hat_tilt_rad)
        
        v_inner.append(bm_hat.verts.new((xi, yi, z_tilted_i)))
        v_outer.append(bm_hat.verts.new((xo, yo, z_tilted_o + pleat_z)))
        
    for i in range(segments):
        i_next = (i + 1) % segments
        bm_hat.faces.new([v_inner[i], v_outer[i], v_outer[i_next], v_inner[i_next]])
        
    mesh_hat_brim = bpy.data.meshes.new("Hat_Brim_Mesh")
    bm_hat.to_mesh(mesh_hat_brim)
    bm_hat.free()
    
    hat_brim = bpy.data.objects.new("Hat_Brim", mesh_hat_brim)
    bpy.context.scene.collection.objects.link(hat_brim)
    hat_brim.data.materials.append(mat_straw)
    mesh_objects.append(hat_brim)

    crown_z = 1.77
    bpy.ops.mesh.primitive_cone_add(vertices=36, radius1=0.155, radius2=0.145, depth=0.13, location=(0, hat_center_y, crown_z), rotation=(hat_tilt_rad, 0, 0))
    hat_crown = bpy.context.active_object
    hat_crown.name = "Hat_Crown"
    hat_crown.data.materials.append(mat_straw)
    mesh_objects.append(hat_crown)

    bpy.ops.mesh.primitive_torus_add(major_segments=36, minor_segments=12, major_radius=0.156, minor_radius=0.010, location=(0, hat_center_y, crown_z - 0.055), rotation=(hat_tilt_rad, 0, 0))
    hat_band = bpy.context.active_object
    hat_band.name = "Hat_Band"
    hat_band.data.materials.append(mat_straw)
    mesh_objects.append(hat_band)

    flag_y = hat_center_y + 0.153 * math.cos(hat_tilt_rad)
    flag_z = crown_z + 0.153 * math.sin(-hat_tilt_rad) + 0.01
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, flag_y, flag_z), rotation=(hat_tilt_rad, 0, 0))
    flag_mesh = bpy.context.active_object
    flag_mesh.scale = (0.115, 0.004, 0.068)
    flag_mesh.name = "Hat_Cambodian_Flag"
    flag_mesh.data.materials.append(mat_flag)
    mesh_objects.append(flag_mesh)

    bpy.ops.mesh.primitive_torus_add(major_segments=32, minor_segments=8, major_radius=0.098, minor_radius=0.005, location=(0, 0.015, 1.54), rotation=(math.radians(24), 0, 0))
    chin_cord = bpy.context.active_object
    chin_cord.scale = (0.76, 1.0, 1.25)
    chin_cord.name = "Hat_ChinCord"
    chin_cord.data.materials.append(mat_cord)
    mesh_objects.append(chin_cord)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.013, location=(0, 0.055, 1.47))
    knot_bead = bpy.context.active_object
    knot_bead.name = "Hat_KnotBead"
    knot_bead.data.materials.append(mat_cord)
    mesh_objects.append(knot_bead)

    for off_x in [-0.007, 0.007]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=0.04, location=(off_x, 0.055, 1.44))
        tassel = bpy.context.active_object
        tassel.name = "Hat_Tassel"
        tassel.data.materials.append(mat_cord)
        mesh_objects.append(tassel)

    # ------------------------------------------
    # C. BRIGHT SAND LINEN SHIRT & TORSO
    # ------------------------------------------
    bm_torso = bmesh.new()
    torso_rings_data = [
        (1.44, 0.065, 0.058),
        (1.39, 0.205, 0.118),
        (1.30, 0.195, 0.126),
        (1.20, 0.175, 0.115),
        (1.08, 0.155, 0.100),
        (0.98, 0.170, 0.112),
    ]
    ring_verts = []
    n_seg = 24
    for z_lvl, rx, ry in torso_rings_data:
        curr_ring = []
        for i in range(n_seg):
            ang = (i / n_seg) * 2 * math.pi
            vx = rx * math.cos(ang)
            vy = ry * math.sin(ang)
            curr_ring.append(bm_torso.verts.new((vx, vy, z_lvl)))
        ring_verts.append(curr_ring)
        
    for r in range(len(ring_verts) - 1):
        for i in range(n_seg):
            i_next = (i + 1) % n_seg
            bm_torso.faces.new([
                ring_verts[r][i],
                ring_verts[r+1][i],
                ring_verts[r+1][i_next],
                ring_verts[r][i_next]
            ])
            
    mesh_torso = bpy.data.meshes.new("TorsoMesh")
    bm_torso.to_mesh(mesh_torso)
    bm_torso.free()
    torso_obj = bpy.data.objects.new("Shirt_Torso", mesh_torso)
    bpy.context.scene.collection.objects.link(torso_obj)
    torso_obj.data.materials.append(mat_linen)
    mesh_objects.append(torso_obj)

    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.062, depth=0.038, location=(0, 0, 1.455))
    collar = bpy.context.active_object
    collar.name = "Shirt_Collar"
    collar.data.materials.append(mat_linen)
    mesh_objects.append(collar)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.128, 1.30))
    placket = bpy.context.active_object
    placket.scale = (0.030, 0.008, 0.22)
    placket.name = "Shirt_Placket"
    placket.data.materials.append(mat_linen)
    mesh_objects.append(placket)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.095, 0.128, 1.28))
    pocket = bpy.context.active_object
    pocket.scale = (0.062, 0.006, 0.072)
    pocket.name = "Shirt_Pocket"
    pocket.data.materials.append(mat_linen)
    mesh_objects.append(pocket)

    for side, sx in [("L", -0.19), ("R", 0.19)]:
        sign = -1 if side == "L" else 1
        
        bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=14, radius=0.068, location=(sx, 0, 1.36))
        shoulder_cap = bpy.context.active_object
        shoulder_cap.scale = (1.1, 0.95, 1.0)
        shoulder_cap.name = f"ShoulderCap_{side}"
        shoulder_cap.data.materials.append(mat_linen)
        mesh_objects.append(shoulder_cap)

        elbow_x = sx + sign * 0.035
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.062, depth=0.22, location=((sx + elbow_x)/2, 0, 1.25), rotation=(0, math.radians(-sign * 9), 0))
        sleeve = bpy.context.active_object
        sleeve.name = f"Sleeve_{side}"
        sleeve.data.materials.append(mat_linen)
        mesh_objects.append(sleeve)

        bpy.ops.mesh.primitive_torus_add(major_segments=24, minor_segments=10, major_radius=0.066, minor_radius=0.016, location=(elbow_x, 0, 1.14), rotation=(0, math.radians(-sign * 9), 0))
        cuff = bpy.context.active_object
        cuff.name = f"SleeveCuff_{side}"
        cuff.data.materials.append(mat_linen)
        mesh_objects.append(cuff)

        wrist_x = elbow_x + sign * 0.01
        bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=0.045, radius2=0.033, depth=0.24, location=((elbow_x + wrist_x)/2, 0, 0.99))
        forearm = bpy.context.active_object
        forearm.name = f"Forearm_{side}"
        forearm.data.materials.append(mat_skin)
        mesh_objects.append(forearm)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(wrist_x, 0, 0.82))
        hand = bpy.context.active_object
        hand.scale = (0.040, 0.065, 0.090)
        hand.name = f"Hand_{side}"
        hand.data.materials.append(mat_skin)
        mesh_objects.append(hand)

        thumb_x = wrist_x + (-0.022 if side == "L" else 0.022)
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.010, depth=0.042, location=(thumb_x, 0.018, 0.82), rotation=(math.radians(25), 0, 0))
        thumb = bpy.context.active_object
        thumb.name = f"Thumb_{side}"
        thumb.data.materials.append(mat_skin)
        mesh_objects.append(thumb)

    # ------------------------------------------
    # D. RED & WHITE KRAMA SASH
    # ------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.19, depth=0.12, location=(0, 0, 1.03))
    krama_belt = bpy.context.active_object
    krama_belt.scale = (1.04, 0.70, 1.0)
    krama_belt.name = "Krama_Belt"
    krama_belt.data.materials.append(mat_krama)
    mesh_objects.append(krama_belt)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=14, radius=0.055, location=(-0.20, 0.07, 1.03))
    knot = bpy.context.active_object
    knot.scale = (1.2, 0.82, 0.95)
    knot.name = "Krama_Knot"
    knot.data.materials.append(mat_krama)
    mesh_objects.append(knot)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.20, 0.09, 0.82))
    krama_tail = bpy.context.active_object
    krama_tail.scale = (0.12, 0.022, 0.40)
    krama_tail.name = "Krama_Tail"
    krama_tail.data.materials.append(mat_krama)
    mesh_objects.append(krama_tail)

    for tx in np.linspace(-0.24, -0.16, 7):
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.003, depth=0.045, location=(tx, 0.09, 0.60))
        fringe = bpy.context.active_object
        fringe.name = "Krama_Fringe"
        fringe.data.materials.append(mat_straw)
        mesh_objects.append(fringe)

    # ------------------------------------------
    # E. VOLUMINOUS CHESTNUT BROWN CHONG KBEN PANTS
    # ------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.22, depth=0.22, location=(0, 0, 0.90))
    pelvis = bpy.context.active_object
    pelvis.scale = (1.05, 0.76, 1.0)
    pelvis.name = "ChongKben_Pelvis"
    pelvis.data.materials.append(mat_chongkben)
    mesh_objects.append(pelvis)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.08, 0.78))
    center_drape = bpy.context.active_object
    center_drape.scale = (0.10, 0.05, 0.28)
    center_drape.name = "ChongKben_CenterDrape"
    center_drape.data.materials.append(mat_chongkben)
    mesh_objects.append(center_drape)

    for side, sx in [("L", -0.125), ("R", 0.125)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=0.145, depth=0.36, location=(sx, 0, 0.68))
        thigh = bpy.context.active_object
        thigh.scale = (1.05, 1.18, 1.0)
        thigh.name = f"ChongKben_Thigh_{side}"
        thigh.data.materials.append(mat_chongkben)
        mesh_objects.append(thigh)

        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.095, depth=0.08, location=(sx, 0, 0.49))
        knee_tuck = bpy.context.active_object
        knee_tuck.name = f"ChongKben_Knee_{side}"
        knee_tuck.data.materials.append(mat_chongkben)
        mesh_objects.append(knee_tuck)

    # ------------------------------------------
    # F. HIGH LEATHER EXPEDITION BOOTS
    # ------------------------------------------
    for side, sx in [("L", -0.125), ("R", 0.125)]:
        bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.086, radius2=0.060, depth=0.38, location=(sx, 0, 0.29))
        boot_shaft = bpy.context.active_object
        boot_shaft.scale = (0.95, 1.08, 1.0)
        boot_shaft.name = f"Boot_Shaft_{side}"
        boot_shaft.data.materials.append(mat_boots)
        mesh_objects.append(boot_shaft)

        bpy.ops.mesh.primitive_torus_add(major_segments=24, minor_segments=8, major_radius=0.062, minor_radius=0.009, location=(sx, 0, 0.13))
        ankle_ring = bpy.context.active_object
        ankle_ring.name = f"Boot_Ankle_{side}"
        ankle_ring.data.materials.append(mat_boots)
        mesh_objects.append(ankle_ring)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, 0.052, 0.055))
        boot_foot = bpy.context.active_object
        boot_foot.scale = (0.110, 0.25, 0.10)
        boot_foot.name = f"Boot_Foot_{side}"
        boot_foot.data.materials.append(mat_boots)
        mesh_objects.append(boot_foot)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, -0.055, 0.022))
        heel = bpy.context.active_object
        heel.scale = (0.105, 0.08, 0.038)
        heel.name = f"Boot_Heel_{side}"
        heel.data.materials.append(mat_boots)
        mesh_objects.append(heel)

    # Join all meshes and apply smooth normals
    bpy.ops.object.select_all(action='DESELECT')
    for obj in mesh_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objects[0]
    bpy.ops.object.join()
    char_mesh = bpy.context.active_object
    char_mesh.name = "KhmerAvatarMesh"

    for poly in char_mesh.data.polygons:
        poly.use_smooth = True

    # ------------------------------------------
    # G. ARMATURE RIGGING WITH EXPLICIT VERTEX WEIGHT GROUPS
    # ------------------------------------------
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

    add_bone("Root", (0, 0, 0), (0, 0, 0.2))
    add_bone("Hips", (0, 0, 0.95), (0, 0, 1.15), "Root")
    add_bone("Chest", (0, 0, 1.15), (0, 0, 1.45), "Hips")
    add_bone("Neck", (0, 0, 1.45), (0, 0, 1.55), "Chest")
    add_bone("Head", (0, 0, 1.55), (0, 0, 1.95), "Neck")

    for side, sx in [("L", -0.125), ("R", 0.125)]:
        add_bone(f"UpperLeg_{side}", (sx, 0, 0.95), (sx, 0, 0.50), "Hips")
        add_bone(f"LowerLeg_{side}", (sx, 0, 0.50), (sx, 0, 0.12), f"UpperLeg_{side}")
        add_bone(f"Foot_{side}", (sx, 0, 0.12), (sx, 0.15, 0.02), f"LowerLeg_{side}")

    for side, sx in [("L", -0.19), ("R", 0.19)]:
        sign = -1 if side == "L" else 1
        add_bone(f"UpperArm_{side}", (sx, 0, 1.36), (sx + sign*0.035, 0, 1.14), "Chest")
        add_bone(f"Forearm_{side}", (sx + sign*0.035, 0, 1.14), (sx + sign*0.045, 0, 0.88), f"UpperArm_{side}")
        add_bone(f"Hand_{side}", (sx + sign*0.045, 0, 0.88), (sx + sign*0.045, 0, 0.74), f"Forearm_{side}")

    bpy.ops.object.mode_set(mode='OBJECT')

    # Explicit vertex group creation & assignment to eliminate any weighting failure!
    bone_names = [
        "Root", "Hips", "Chest", "Neck", "Head",
        "UpperLeg_L", "LowerLeg_L", "Foot_L",
        "UpperLeg_R", "LowerLeg_R", "Foot_R",
        "UpperArm_L", "Forearm_L", "Hand_L",
        "UpperArm_R", "Forearm_R", "Hand_R"
    ]
    for bname in bone_names:
        char_mesh.vertex_groups.new(name=bname)
        
    vgroups = {bname: char_mesh.vertex_groups[bname] for bname in bone_names}

    for v in char_mesh.data.vertices:
        x, y, z = v.co
        idx = v.index
        
        if z >= 1.55:
            vgroups["Head"].add([idx], 1.0, 'REPLACE')
        elif z >= 1.45 and abs(x) < 0.14:
            vgroups["Neck"].add([idx], 1.0, 'REPLACE')
        elif x < -0.16 and z >= 0.70:
            if z >= 1.14:
                vgroups["UpperArm_L"].add([idx], 1.0, 'REPLACE')
            elif z >= 0.88:
                vgroups["Forearm_L"].add([idx], 1.0, 'REPLACE')
            else:
                vgroups["Hand_L"].add([idx], 1.0, 'REPLACE')
        elif x > 0.16 and z >= 0.70:
            if z >= 1.14:
                vgroups["UpperArm_R"].add([idx], 1.0, 'REPLACE')
            elif z >= 0.88:
                vgroups["Forearm_R"].add([idx], 1.0, 'REPLACE')
            else:
                vgroups["Hand_R"].add([idx], 1.0, 'REPLACE')
        elif z >= 1.15:
            vgroups["Chest"].add([idx], 1.0, 'REPLACE')
        elif z >= 0.95:
            vgroups["Hips"].add([idx], 1.0, 'REPLACE')
        elif x <= 0:
            if z >= 0.49:
                vgroups["UpperLeg_L"].add([idx], 1.0, 'REPLACE')
            elif z >= 0.12:
                vgroups["LowerLeg_L"].add([idx], 1.0, 'REPLACE')
            else:
                vgroups["Foot_L"].add([idx], 1.0, 'REPLACE')
        else:
            if z >= 0.49:
                vgroups["UpperLeg_R"].add([idx], 1.0, 'REPLACE')
            elif z >= 0.12:
                vgroups["LowerLeg_R"].add([idx], 1.0, 'REPLACE')
            else:
                vgroups["Foot_R"].add([idx], 1.0, 'REPLACE')

    # Bind Mesh to Armature
    arm_mod = char_mesh.modifiers.new(name="Armature", type='ARMATURE')
    arm_mod.object = arm_obj
    char_mesh.parent = arm_obj

    # ------------------------------------------
    # H. ANIMATIONS (Idle, Walk, Run, Jump, Attack, Dash, Wave, Bow)
    # ------------------------------------------
    arm_obj.animation_data_create()

    def create_action(name, keyframes_func, frame_count):
        act = bpy.data.actions.new(name=name)
        arm_obj.animation_data.action = act
        keyframes_func(act, frame_count)
        return act

    # 1. Idle (Breathing)
    def anim_idle(act, length=60):
        for f in [1, 30, 60]:
            t = (f - 1) / (length - 1)
            breath = math.sin(t * 2 * math.pi)
            arm_obj.pose.bones['Chest'].scale = (1.0 + breath * 0.015, 1.0 + breath * 0.025, 1.0)
            arm_obj.pose.bones['Chest'].keyframe_insert('scale', frame=f)
            arm_obj.pose.bones['Hips'].location = (0, 0, breath * 0.008)
            arm_obj.pose.bones['Hips'].keyframe_insert('location', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = (0, 0, math.radians(-3 + breath * 1.5))
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = (0, 0, math.radians(3 - breath * 1.5))
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Idle", anim_idle, 60)

    # 2. Walk
    def anim_walk(act, length=30):
        frames = [
            (1, (18, 0, 0), (-18, 0, 0), (-16, 0, 0), (16, 0, 0), 0),
            (8, (0, 0, 0), (0, 0, 0), (0, 0, 0), (0, 0, 0), 0.015),
            (15, (-18, 0, 0), (18, 0, 0), (16, 0, 0), (-16, 0, 0), 0),
            (23, (0, 0, 0), (0, 0, 0), (0, 0, 0), (0, 0, 0), 0.015),
            (30, (18, 0, 0), (-18, 0, 0), (-16, 0, 0), (16, 0, 0), 0),
        ]
        for f, l_leg, r_leg, l_arm, r_arm, z_bob in frames:
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

    # 3. Run
    def anim_run(act, length=20):
        frames = [
            (1, (35, 0, 0), (-35, 0, 0), (-32, 0, 0), (32, 0, 0), 0),
            (5, (0, 0, 0), (0, 0, 0), (0, 0, 0), (0, 0, 0), 0.035),
            (10, (-35, 0, 0), (35, 0, 0), (32, 0, 0), (-32, 0, 0), 0),
            (15, (0, 0, 0), (0, 0, 0), (0, 0, 0), (0, 0, 0), 0.035),
            (20, (35, 0, 0), (-35, 0, 0), (-32, 0, 0), (32, 0, 0), 0),
        ]
        for f, l_leg, r_leg, l_arm, r_arm, z_bob in frames:
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

    # 4. Jump (លោតឡើងលើ)
    def anim_jump(act, length=30):
        # f: (hips_z, chest_rot_x, leg_rot_x, arm_rot_x)
        keyframes = [
            (1, 0.0, 0, 0, 0),
            (6, -0.06, 15, -25, 20),      # Crouch windup
            (14, 0.22, -10, 25, -55),     # Apex of jump in air
            (22, 0.08, 5, 10, -20),       # Falling down
            (26, -0.04, 12, -18, 15),     # Landing impact
            (30, 0.0, 0, 0, 0),           # Recover to stand
        ]
        for f, hz, cx, lx, ax in keyframes:
            arm_obj.pose.bones['Hips'].location = (0, 0, hz)
            arm_obj.pose.bones['Hips'].keyframe_insert('location', frame=f)
            arm_obj.pose.bones['Chest'].rotation_euler = (math.radians(cx), 0, 0)
            arm_obj.pose.bones['Chest'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperLeg_L'].rotation_euler = (math.radians(lx), 0, 0)
            arm_obj.pose.bones['UpperLeg_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperLeg_R'].rotation_euler = (math.radians(lx), 0, 0)
            arm_obj.pose.bones['UpperLeg_R'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = (math.radians(ax), 0, math.radians(15))
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = (math.radians(ax), 0, math.radians(-15))
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Jump", anim_jump, 30)

    # 5. Attack (វាយប្រហារ/ដាល់ទៅមុខ)
    def anim_attack(act, length=24):
        # Dynamic right straight punch
        keyframes = [
            (1, 0, (0, 0, 0), (0, 0, 0)),
            (6, -0.02, (10, 0, 20), (30, 0, -10)),    # Wind-up right fist back
            (12, 0.04, (-8, 0, -25), (-95, 0, 15)),  # Power punch forward!
            (18, 0.01, (-2, 0, -10), (-40, 0, 10)),   # Follow-through
            (24, 0, (0, 0, 0), (0, 0, 0)),            # Return to stance
        ]
        for f, hy, chest_rot, r_arm_rot in keyframes:
            arm_obj.pose.bones['Hips'].location = (0, hy, 0)
            arm_obj.pose.bones['Hips'].keyframe_insert('location', frame=f)
            arm_obj.pose.bones['Chest'].rotation_euler = [math.radians(x) for x in chest_rot]
            arm_obj.pose.bones['Chest'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = [math.radians(x) for x in r_arm_rot]
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
            # Left arm guards chest
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = (math.radians(-30), 0, math.radians(20))
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
    create_action("Attack", anim_attack, 24)

    # 6. Dash (ហក់/បោះខ្លួនទៅមុខ)
    def anim_dash(act, length=18):
        keyframes = [
            (1, (0, 0, 0), 0, (0, 0)),
            (8, (28, 0, 0), -0.08, (-45, 45)),   # Low aerodynamic lunge
            (14, (15, 0, 0), -0.03, (-20, 20)),  # Recovery
            (18, (0, 0, 0), 0, (0, 0)),
        ]
        for f, chest_rot, hz, leg_rots in keyframes:
            arm_obj.pose.bones['Chest'].rotation_euler = [math.radians(x) for x in chest_rot]
            arm_obj.pose.bones['Chest'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['Hips'].location = (0, 0, hz)
            arm_obj.pose.bones['Hips'].keyframe_insert('location', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = (math.radians(45), 0, math.radians(10))
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = (math.radians(45), 0, math.radians(-10))
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperLeg_L'].rotation_euler = (math.radians(leg_rots[0]), 0, 0)
            arm_obj.pose.bones['UpperLeg_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperLeg_R'].rotation_euler = (math.radians(leg_rots[1]), 0, 0)
            arm_obj.pose.bones['UpperLeg_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Dash", anim_dash, 18)

    # 7. Wave
    def anim_wave(act, length=40):
        for f, rot_z in [(1, 0), (10, 25), (20, -15), (30, 25), (40, 0)]:
            pb = arm_obj.pose.bones['UpperArm_R']
            pb.rotation_euler = (math.radians(-110), 0, math.radians(rot_z))
            pb.keyframe_insert('rotation_euler', frame=f)
    create_action("Wave", anim_wave, 40)

    # 8. Khmer Sampeah Bow (សំពះ)
    def anim_bow(act, length=50):
        for f, bow_angle in [(1, 0), (25, 25), (50, 0)]:
            arm_obj.pose.bones['Chest'].rotation_euler = (math.radians(bow_angle), 0, 0)
            arm_obj.pose.bones['Chest'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['Head'].rotation_euler = (math.radians(bow_angle * 0.8), 0, 0)
            arm_obj.pose.bones['Head'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_L'].rotation_euler = (math.radians(-42), math.radians(22), math.radians(35))
            arm_obj.pose.bones['UpperArm_L'].keyframe_insert('rotation_euler', frame=f)
            arm_obj.pose.bones['UpperArm_R'].rotation_euler = (math.radians(-42), math.radians(-22), math.radians(-35))
            arm_obj.pose.bones['UpperArm_R'].keyframe_insert('rotation_euler', frame=f)
    create_action("Bow", anim_bow, 50)

    # Reset pose
    arm_obj.animation_data.action = None
    for pb in arm_obj.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_euler = (0, 0, 0)
        pb.scale = (1, 1, 1)

    # ------------------------------------------
    # I. EXPORT TO GLB
    # ------------------------------------------
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        export_animations=True
    )
    print(f"✓ Rigged & Animated Khmer Avatar exported to: {output_glb}")

    # ------------------------------------------
    # J. RENDER HIGH-RES PREVIEW IMAGE
    # ------------------------------------------
    if preview_path:
        os.makedirs(os.path.dirname(preview_path), exist_ok=True)
        cam_data = bpy.data.cameras.new('PreviewCam')
        cam_obj = bpy.data.objects.new('PreviewCam', cam_data)
        bpy.context.scene.collection.objects.link(cam_obj)
        bpy.context.scene.camera = cam_obj
        
        cam_obj.location = (0.45, 3.2, 1.10)
        cam_obj.rotation_euler = (math.radians(91), math.radians(0), math.radians(172))

        sun_data = bpy.data.lights.new('KeySun', type='SUN')
        sun_obj = bpy.data.objects.new('KeySun', sun_data)
        bpy.context.scene.collection.objects.link(sun_obj)
        sun_obj.location = (1.5, 3.5, 3.0)
        sun_data.energy = 5.0

        fill_data = bpy.data.lights.new('FillSun', type='SUN')
        fill_obj = bpy.data.objects.new('FillSun', fill_data)
        bpy.context.scene.collection.objects.link(fill_obj)
        fill_obj.location = (-1.5, 3.0, 1.8)
        fill_data.energy = 3.5

        bpy.context.scene.render.engine = 'BLENDER_WORKBENCH'
        bpy.context.scene.display.shading.light = 'STUDIO'
        bpy.context.scene.display.shading.color_type = 'TEXTURE'
        bpy.context.scene.render.resolution_x = 768
        bpy.context.scene.render.resolution_y = 1024
        bpy.context.scene.render.filepath = preview_path
        bpy.ops.render.render(write_still=True)
        print(f"✓ High-Res Preview image rendered to: {preview_path}")

if __name__ == "__main__":
    workspace = os.path.abspath(".")
    target_glb = os.path.join(workspace, "public", "models", "characters", "new.glb")
    preview_img = os.path.abspath(r"C:\Users\Administrator\.gemini\antigravity-ide\brain\90d8dfb3-da4e-4b16-b4b9-9103a8cb758a\scratch\khmer_avatar_preview.png")
    build_khmer_avatar(target_glb, preview_img)
