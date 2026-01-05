<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OrganisationController extends AbstractController
{
    #[Route('/api/organisations', name: 'api_organisations_list', methods: ['GET'])]
    public function list(Connection $db): JsonResponse
    {
        $rows = $db->fetchAllAssociative('SELECT id, nom, adresse, ville, code_postal, pays, telephone, whatsapp, email, site_web, description, logo, statut, date_creation, date_modification FROM organisations ORDER BY nom ASC');
        return $this->json($rows);
    }

    #[Route('/api/organisations', name: 'api_organisations_create', methods: ['POST'])]
    public function create(Request $request, Connection $db): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $nom = trim((string)($payload['nom'] ?? ''));
        if ($nom === '') {
            return $this->json(['error' => 'nom requis'], Response::HTTP_BAD_REQUEST);
        }
        // Insert only columns that exist
        $columns = [];
        try {
            $sm = $db->createSchemaManager();
            foreach ($sm->listTableColumns('organisations') as $c) {
                $columns[strtolower($c->getName())] = $c->getName();
            }
        } catch (\Throwable $e) {
            $columns = ['nom' => 'nom', 'description' => 'description'];
        }
        $c = fn($name) => $columns[$name] ?? null;
        $data = [];
        if ($c('nom')) $data[$c('nom')] = $nom;
        if ($c('description')) $data[$c('description')] = $payload['description'] ?? null;
        if ($c('adresse')) $data[$c('adresse')] = $payload['adresse'] ?? null;
        if ($c('ville')) $data[$c('ville')] = $payload['ville'] ?? null;
        if ($c('code_postal')) $data[$c('code_postal')] = $payload['code_postal'] ?? null;
        if ($c('pays')) $data[$c('pays')] = $payload['pays'] ?? 'Maroc';
        if ($c('telephone')) $data[$c('telephone')] = $payload['telephone'] ?? null;
        if ($c('whatsapp')) $data[$c('whatsapp')] = $payload['whatsapp'] ?? null;
        if ($c('email')) $data[$c('email')] = $payload['email'] ?? null;
        if ($c('site_web')) $data[$c('site_web')] = $payload['site_web'] ?? null;
        if ($c('logo')) $data[$c('logo')] = $payload['logo'] ?? null;
        if ($c('statut')) $data[$c('statut')] = $payload['statut'] ?? 'ACTIVE';

        $db->insert('organisations', $data);
        $id = (int)$db->lastInsertId();
        $row = $db->fetchAssociative('SELECT * FROM organisations WHERE id = :id', ['id' => $id]);
        return $this->json($row, Response::HTTP_CREATED);
    }

    #[Route('/api/organisations/{id}', name: 'api_organisations_delete', methods: ['DELETE'])]
    public function delete(int $id, Connection $db): JsonResponse
    {
        $exists = $db->fetchOne('SELECT 1 FROM organisations WHERE id = :id', ['id' => $id]);
        if (!$exists) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        $db->delete('organisations', ['id' => $id]);
        return $this->json(['status' => 'deleted']);
    }
}
